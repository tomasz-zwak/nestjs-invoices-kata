import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { ContractorsService } from '../contractors/contractors.service';
import { CreateContractorDto } from '../contractors/dto/create-contractor.dto';
import { Contractor } from '../contractors/entities/contractor.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItemCategory)
    private readonly invoiceItemCategoryRepository: Repository<InvoiceItemCategory>,
    private readonly contractorService: ContractorsService,
  ) {}

  async findAll() {
    return await this.invoiceRepository.find({
      relations: ['contractor'],
    });
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne(id, {
      // relations: ['contractor', 'invoiceItems'],
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
    console.log(invoiceDto);
    return this.invoiceRepository.save({
      ...invoice,
      invoiceNo,
      contractor,
    });
  }

  async update(id: number, invoiceDto: UpdateInvoiceDto) {
    // console.log(invoiceDto);
    let invoice = await this.findOne(id);
    if (invoice.approved) {
      throw new BadRequestException('Cannot edit already approved invoices.');
    }

    const { contractorId, newContractor } = invoiceDto;
    const contractor = await this.preloadContractor(
      contractorId,
      newContractor,
    );
    invoice = await this.invoiceRepository.preload({
      id: id,
      ...invoiceDto,
      contractor,
    });
    return this.invoiceRepository.save(invoice);
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

  private async getNextInvoiceNumber() {
    const invoiceNoArr = await this.invoiceRepository.find({
      select: ['invoiceNo'],
      order: { createdAt: 'DESC' },
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
    } else {
      return await this.contractorService.create(newContractor);
    }
  }
}
