import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildEntityObject } from '../../test/utils/entity-mocks';
import { MockAuthGuard } from '../../test/utils/mock-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContractorsService } from '../contractors/contractors.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceItemDto } from './dto/invoice-item.dto';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { Invoice } from './entities/invoice.entity';
import {
  Currency,
  InvoiceCalculationMethod,
  MeasureUnit,
} from './invoice.type';
import { InvoicesService } from './invoices.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
});

describe('InvoicesService', () => {
  let invoicesService: InvoicesService;
  let invoiceRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(InvoiceItemCategory),
          useValue: createMockRepository(),
        },
        { provide: MailService, useValue: {} },
        { provide: PdfService, useValue: {} },
        { provide: ContractorsService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    invoicesService = module.get<InvoicesService>(InvoicesService);
    invoiceRepository = module.get<MockRepository>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(invoicesService).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return an array of Invoices', async () => {
      const result = buildInvoicesArray();
      jest.spyOn(invoicesService, 'findAll').mockResolvedValue(result);
      expect(await invoicesService.findAll(buildUser())).toBe(result);
    });
  });

  describe('#findOne', () => {
    describe('when invoice with ID exists for an user', () => {
      it('should return single instance of an invoice', async () => {
        const user = buildUser({ id: 1 });
        const result = await buildEntityObject<Invoice>({
          partial: true,
          fields: { id: 1, user },
        });
        const id = 1;
        invoiceRepository.findOne.mockReturnValue(result);
        expect(await invoicesService.findOne(id, user)).toBe(result);
      });
    });
    describe('otherwise', () => {
      it('should throw NotFoundException if invoice is not found', async () => {
        const user = buildUser({ id: 1 });
        const id = 1;
        invoiceRepository.findOne.mockReturnValue(undefined);
        try {
          await invoicesService.findOne(id, user);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          // expect(error).toEqual(`Invoice #${id} could not be found.`);
        }
      });
    });
    describe('#create', () => {
      const invoiceItemDto: InvoiceItemDto = {
        amount: 100,
        description: 'abc',
        vatRate: 0.23,
        discount: 0,
        measureUnit: MeasureUnit.PIECE,
        price: 5,
        categoryId: 1,
      };
      const invoiceDto: CreateInvoiceDto = {
        currency: Currency.PLN,
        invoiceCalculationMethod: InvoiceCalculationMethod.NET,
        invoiceItems: [invoiceItemDto],
      };
      const user = buildUser();
      it('should create new Invoice', async () => {
        const invoiceItems = [await buildInvoiceItem({ ...invoiceItemDto })];
        const invoice = await buildInvoice({ ...invoiceDto, invoiceItems });
        const contractor = await buildContractor();
        const returnedInvoice = await buildInvoice({
          ...invoice,
          invoiceNo: 'A1/1/2022',
          contractor,
          grossValue: 615,
          vatValue: 115,
        });
        jest
          .spyOn<any, any>(invoicesService, 'preloadContractor')
          .mockResolvedValue(contractor);
        invoiceRepository.create.mockReturnValue(invoice);
        invoiceRepository.save.mockReturnValue(returnedInvoice);
        expect(await invoicesService.create(invoiceDto, user)).toBe(
          returnedInvoice,
        );
      });
    });
  });
});
