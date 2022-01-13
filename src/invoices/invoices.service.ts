import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { round } from '../commons/utils/utils';
import { ContractorsService } from '../contractors/contractors.service';
import { CreateContractorDto } from '../contractors/dto/create-contractor.dto';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { PdfResponse, PdfTemplate } from '../pdf/pdf.type';
import { User } from '../user/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceCalculationMethod } from './invoice.type';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItemCategory)
    private readonly invoiceItemCategoryRepository: Repository<InvoiceItemCategory>,
    private readonly mailService: MailService,
    private readonly pdfService: PdfService,
    private readonly contractorService: ContractorsService,
  ) {}

  async findAll(user: User) {
    return await this.invoiceRepository.find({
      where: { user: user },
    });
  }

  async findOne(id: number, user: User): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne(id, {
      relations: ['contractor', 'invoiceItems', 'user'],
      where: { user: user },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} could not be found.`);
    }
    return invoice;
  }

  async create(invoiceDto: CreateInvoiceDto, user: User) {
    const invoice = this.invoiceRepository.create({ ...invoiceDto, user });

    const invoiceNo =
      invoiceDto.invoiceNo ?? (await this.getNextInvoiceNumber());

    const { contractorId, newContractor } = invoiceDto;
    const contractor = await this.preloadContractor(
      contractorId,
      newContractor,
      user,
    );

    const { invoiceItems, grossValue, vatValue } =
      this.calculateInvoice(invoice);

    return await this.invoiceRepository.save({
      ...invoice,
      invoiceNo,
      contractor,
      invoiceItems,
      grossValue,
      vatValue,
    });
  }

  async update(id: number, invoiceDto: UpdateInvoiceDto, user: User) {
    const invoice = await this.invoiceRepository.preload({
      id: id,
      ...invoiceDto,
    });
    if (invoice.approved) {
      throw new BadRequestException('Cannot edit already approved invoices.');
    }

    const { contractorId, newContractor } = invoiceDto;
    const contractor = await this.preloadContractor(
      contractorId,
      newContractor,
      user,
    );

    const { invoiceItems, grossValue, vatValue } =
      this.calculateInvoice(invoice);

    return await this.invoiceRepository.save({
      ...invoice,
      contractor,
      invoiceItems,
      grossValue,
      vatValue,
    });
  }

  async delete(id: number, user: User) {
    const invoice = await this.findOne(id, user);
    return this.invoiceRepository.remove(invoice);
  }

  async listItemCategories() {
    return await this.invoiceItemCategoryRepository.find();
  }

  async listInvoiceItems(invoiceId: number) {
    const invoice = await this.invoiceRepository.findOne(invoiceId, {
      relations: ['invoiceItems'],
    });
    return invoice.invoiceItems;
  }

  async approve(id: number, value: boolean, user: User) {
    const invoice = await this.findOne(id, user);
    invoice.approved = value;
    await this.invoiceRepository.save(invoice);
    if (value) {
      this.generatePdf(invoice);
      return `Invoice ${invoice.invoiceNo} approved.`;
    } else {
      return `Invoice ${invoice.invoiceNo} unapproved.`;
    }
  }

  async send(id: number, user: User) {
    const invoice = await this.findOne(id, user);
    if (!invoice.approved) {
      throw new BadRequestException(
        `Invoice ${invoice.invoiceNo} is not approved yet, you cannot send unapproved invoices`,
      );
    }

    this.mailService.invoiceAlert(user, invoice).send();
  }

  async download(id: number, user: User): Promise<PdfResponse> {
    const invoice = await this.findOne(id, user);
    const { fileData: data, fileName: name } = invoice;
    if (data && name) {
      return {
        data,
        name,
      };
    }
    throw new NotFoundException();
  }

  private async getNextInvoiceNumber() {
    const invoiceNoArr = await this.invoiceRepository.find({
      select: ['invoiceNo'],
      order: { id: 'DESC' },
      take: 1,
    });
    return this.generateNextInvoiceNumber(invoiceNoArr?.[0]?.invoiceNo);
  }

  private async generateNextInvoiceNumber(lastInvoiceNumber: string) {
    let counter = 1;
    const date = new Date();
    const [month, year] = [date.getMonth() + 1, date.getFullYear()];
    if (lastInvoiceNumber) {
      counter = parseInt(lastInvoiceNumber.split('/')[0].replace('A', '')) + 1;
      if (isNaN(counter)) {
        counter = await this.invoiceRepository.count();
      }
    }
    return `A${counter}/${month}/${year}`;
  }

  private async preloadContractor(
    contractorId: number | undefined,
    newContractor: CreateContractorDto,
    user: User,
  ) {
    if (contractorId) {
      return await this.contractorService.findOne(contractorId, user);
    } else if (newContractor) {
      return await this.contractorService.create(newContractor, user);
    }
  }

  private calculateInvoice(invoice: Invoice) {
    const invoiceItems = invoice.invoiceItems;
    const calculationMethod = invoice.invoiceCalculationMethod;
    invoiceItems.forEach((item) => {
      const { amount, price, discount, vatRate } = item;
      if (calculationMethod === InvoiceCalculationMethod.NET) {
        item.grossValue = round(
          price * amount * (1 - 1 * discount + 1 * vatRate),
          2,
        );
        item.vatValue = round(item.grossValue - price * amount, 2);
      } else {
        item.grossValue = round(price * amount, 2);
        item.vatValue = round(
          item.grossValue - item.grossValue / (1 + vatRate),
          2,
        );
      }
    });
    const invoiceTotals = invoiceItems.reduce(
      (curr, next) => {
        const { grossValue, vatValue } = curr;
        return {
          grossValue: grossValue + next.grossValue,
          vatValue: vatValue + next.vatValue,
        };
      },
      { grossValue: 0, vatValue: 0 },
    );

    return { invoiceItems, ...invoiceTotals };
  }

  private generatePdf(invoice: Invoice) {
    this.pdfService
      .preparePdf({
        template: PdfTemplate.INVOICE,
        data: {
          contractor: invoice.contractor,
          invoice: invoice,
          user: invoice.user,
        },
      })
      .generate();
  }
}
