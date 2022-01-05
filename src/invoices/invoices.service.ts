import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { values } from 'lodash';
import { Repository } from 'typeorm';
import { round } from '../commons/utils/utils';
import { ContractorsService } from '../contractors/contractors.service';
import { CreateContractorDto } from '../contractors/dto/create-contractor.dto';
import { Contractor } from '../contractors/entities/contractor.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceCalculationMethod } from './invoice.type';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItemCategory)
    private readonly invoiceItemCategoryRepository: Repository<InvoiceItemCategory>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    private readonly contractorService: ContractorsService,
  ) {}

  async findAll() {
    return await this.invoiceRepository.find();
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne(id, {
      relations: ['contractor', 'invoiceItems'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} could not be found.`);
    }
    return invoice;
  }

  async create(invoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create(invoiceDto);

    const invoiceNo =
      invoiceDto.invoiceNo ?? (await this.getNextInvoiceNumber());

    const { contractorId, newContractor } = invoiceDto;
    const contractor = await this.preloadContractor(
      contractorId,
      newContractor,
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

  async update(id: number, invoiceDto: UpdateInvoiceDto) {
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

  async delete(id: number) {
    const invoice = await this.findOne(id);
    return this.invoiceRepository.remove(invoice);
  }

  async deleteAll() {
    const invoices = await this.findAll();
    invoices.forEach(async (inv) => await this.invoiceRepository.remove(inv));
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

  async approve(id: number, value: boolean) {
    await this.invoiceRepository.update(id, { approved: value });
    if (value) {
      return `Invoice #${id} approved.`;
    } else {
      return `Invoice #${id} unapproved.`;
    }
  }

  private async getNextInvoiceNumber() {
    const invoiceNoArr = await this.invoiceRepository.find({
      select: ['invoiceNo'],
      order: { id: 'ASC' },
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
  ) {
    if (contractorId) {
      return await this.contractorService.findOne(contractorId);
    } else if (newContractor) {
      return await this.contractorService.create(newContractor);
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
}
