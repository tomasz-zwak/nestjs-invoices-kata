import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { buffer } from 'stream/consumers';
import { Repository } from 'typeorm';
import {
  buildEntityObject,
  buildInvoicesArray,
} from '../../test/utils/entity-mocks';
import { MockAuthGuard } from '../../test/utils/mock-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContractorsService } from '../contractors/contractors.service';
import { Contractor } from '../contractors/entities/contractor.entity';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { User } from '../user/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceItemDto } from './dto/invoice-item.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
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
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('InvoicesService', () => {
  let invoicesService: InvoicesService;
  let invoiceRepository: MockRepository;
  let invoiceItemCategoryRepository: MockRepository;
  let mailService: MailService;

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
        {
          provide: MailService,
          useValue: {
            invoiceAlert: jest.fn().mockImplementation(() => ({
              send: jest.fn(),
            })),
          },
        },
        { provide: PdfService, useValue: {} },
        { provide: ContractorsService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    invoicesService = module.get<InvoicesService>(InvoicesService);
    invoiceRepository = module.get<MockRepository>(getRepositoryToken(Invoice));
    invoiceItemCategoryRepository = module.get<MockRepository>(
      getRepositoryToken(InvoiceItemCategory),
    );
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(invoicesService).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return an array of Invoices', async () => {
      const result = buildInvoicesArray();
      const spiedFindAllService = jest.spyOn(invoicesService, 'findAll');
      jest.spyOn(invoiceRepository, 'find').mockResolvedValue(result);
      const user = await buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      expect(await invoicesService.findAll(user)).toBe(result);
      expect(spiedFindAllService).toBeCalledWith(user);
    });
  });

  describe('#findOne', () => {
    describe('when invoice with ID exists for an user', () => {
      it('should return single instance of an invoice', async () => {
        const user = await buildEntityObject<User>({
          partial: true,
          fields: { id: 1 },
        });
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
        const user = await buildEntityObject<User>({
          partial: true,
          fields: { id: 1 },
        });
        const id = 1;
        invoiceRepository.findOne.mockReturnValue(undefined);
        try {
          await invoicesService.findOne(id, user);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect((error as NotFoundException).message).toEqual(
            `Invoice #${id} could not be found.`,
          );
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
        contractorId: 1,
        currency: Currency.PLN,
        invoiceCalculationMethod: InvoiceCalculationMethod.NET,
        invoiceItems: [invoiceItemDto],
      };
      it('should create new Invoice', async () => {
        const user = await buildEntityObject<User>();
        const contractor = await buildEntityObject<Contractor>({
          partial: true,
          fields: {
            id: 1,
          },
        });
        const spyGetNextInvoiceNumber = jest.spyOn<any, any>(
          invoicesService,
          'getNextInvoiceNumber',
        );
        const spyPreloadContractor = jest
          .spyOn<any, any>(invoicesService, 'preloadContractor')
          .mockResolvedValue(contractor);
        const spyCalculateInvoice = jest.spyOn<any, any>(
          invoicesService,
          'calculateInvoice',
        );
        const invoiceItems = [
          await buildEntityObject<InvoiceItem>({
            partial: true,
            fields: { ...invoiceItemDto },
          }),
        ];
        const invoice = await buildEntityObject<Invoice>({
          partial: true,
          fields: {
            ...invoiceDto,
            invoiceItems,
          },
        });
        const returnedInvoice = await buildEntityObject<Invoice>({
          partial: true,
          fields: {
            ...invoice,
            invoiceNo: 'A1/1/2022',
            contractor,
            grossValue: 615,
            vatValue: 115,
          },
        });
        invoiceRepository.create.mockReturnValue(invoice);
        invoiceRepository.save.mockReturnValue(returnedInvoice);
        expect(await invoicesService.create(invoiceDto, user)).toBe(
          returnedInvoice,
        );
        expect(spyGetNextInvoiceNumber).toBeCalled();
        expect(spyPreloadContractor).toBeCalledWith(
          contractor.id,
          undefined,
          user,
        );
        expect(spyCalculateInvoice).toBeCalledWith(invoice);
      });
    });
    describe('#update', () => {
      const invoice = buildEntityObject<Invoice>({
        partial: true,
        fields: { id: 1, comment: 'comment', invoiceNo: 'asdasd' },
      });
      const invoiceUpdateDto: UpdateInvoiceDto = {
        comment: 'This is a new comment',
      };
      const user = buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      const id = 1;
      const updatedInvoice = { ...invoice, ...invoiceUpdateDto };
      describe('if invoice with id exists in database', () => {
        describe('and is not approved yet', () => {
          it('updates an invoice', async () => {
            jest.spyOn(invoiceRepository, 'preload').mockResolvedValue(invoice);
            jest
              .spyOn(invoiceRepository, 'save')
              .mockResolvedValue(updatedInvoice);
            expect(
              await invoicesService.update(id, invoiceUpdateDto, await user),
            ).toBe(updatedInvoice);
          });
        });
      });

      describe('otherwise', () => {
        describe('if invoice is approved', () => {
          it('throws a BadRequestException', async () => {
            jest.spyOn(invoiceRepository, 'preload').mockResolvedValue(invoice);
            (await invoice).approved = true;
            try {
              await invoicesService.update(id, invoiceUpdateDto, await user);
            } catch (error) {
              expect(error).toBeInstanceOf(BadRequestException);
              expect((error as BadRequestException).message).toEqual(
                'Cannot edit already approved invoices.',
              );
            }
          });
        });
        describe('if invoice could not be found', () => {
          it('throws a NotFoundException', async () => {
            try {
              await invoicesService.update(id, invoiceUpdateDto, await user);
            } catch (error) {
              expect(error).toBeInstanceOf(NotFoundException);
              expect((error as NotFoundException).message).toEqual(
                `Invoice #${id} could not be found.`,
              );
            }
          });
        });
      });
    });
    describe('#delete', () => {
      const invoice = buildEntityObject<Invoice>({
        partial: true,
        fields: { id: 1, comment: 'comment', invoiceNo: 'asdasd' },
      });
      const user = buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      const id = 1;
      describe('if invoice with given id exists', () => {
        it('calls repository #delete method and returns deleted entity without id', async () => {
          invoiceRepository.findOne.mockResolvedValue(await invoice);
          invoiceRepository.remove.mockResolvedValue(await invoice);
          expect(await invoicesService.delete(id, await user)).toBe(
            await invoice,
          );
          expect(invoiceRepository.remove).toBeCalledWith(await invoice);
        });
      });
      describe('otherwise', () => {
        it('throws NotFoundException', async () => {
          try {
            await invoicesService.delete(id, await user);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect((error as NotFoundException).message).toEqual(
              `Invoice #${id} could not be found.`,
            );
          }
        });
      });
    });
    describe('#listItemCategories', () => {
      it('should return an array of ItemCategories', async () => {
        invoiceItemCategoryRepository.find.mockResolvedValue([]);
        expect(await invoicesService.listItemCategories()).toBeInstanceOf(
          Array,
        );
      });
    });
    describe('#listInvoiceItems', () => {
      const id = 1;
      describe('returns an array of InvoiceItems if an invoice with given id exists', () => {
        it('should return an array of InvoiceItems', async () => {
          const invoice = await buildEntityObject<Invoice>();
          const invoiceItem = await buildEntityObject<InvoiceItem>({
            partial: true,
            fields: {
              description: 'a',
            },
          });
          invoice.invoiceItems = [invoiceItem, invoiceItem, invoiceItem];
          invoiceRepository.findOne.mockResolvedValue(invoice);
          const result = await invoicesService.listInvoiceItems(id);
          expect(result).toBe(invoice.invoiceItems);
          expect(result).toHaveLength(invoice.invoiceItems.length);
        });
      });
      describe('otherwise', () => {
        it('throws NotFoundException', async () => {
          try {
            await invoicesService.listInvoiceItems(id);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect((error as NotFoundException).message).toEqual(
              `Invoice #${id} could not be found.`,
            );
          }
        });
      });
    });
    describe('#approve', () => {
      const id = 1;
      const user = buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      const invoice = buildEntityObject<Invoice>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      describe('invoice is present in database and not approved', () => {
        let invoiceMockDb;
        it('calls #generatePdf method and returns message about correct approval', async () => {
          invoiceRepository.findOne.mockResolvedValue(await invoice);
          invoiceMockDb = await invoicesService.findOne(id, await user);
          const spyGeneratePdf = jest
            .spyOn<any, any>(invoicesService, 'generatePdf')
            .mockImplementation();
          await invoicesService.approve(id, true, await user);
          expect(spyGeneratePdf).toBeCalledWith(invoiceMockDb);
        });
      });
      describe('otherwise', () => {
        it('throws NotFoundException', async () => {
          try {
            await invoicesService.approve(id, true, await user);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect((error as NotFoundException).message).toEqual(
              `Invoice #${id} could not be found.`,
            );
          }
        });
      });
    });
    describe('#send', () => {
      const id = 1;
      const invoice = buildEntityObject<Invoice>({
        partial: true,
        fields: {
          id: 1,
          invoiceNo: 'abcd',
        },
      });
      const user = buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      describe('if invoice is found and approved', () => {
        it('calls mailservice#send method and returns invoice id', async () => {
          const invoiceResolved = await invoice;
          invoiceResolved.approved = true;
          invoiceRepository.findOne.mockResolvedValue(invoiceResolved);
          const result = await invoicesService.send(id, await user);
          const spyInvoiceAlert = jest.spyOn<any, any>(
            mailService,
            'invoiceAlert',
          );
          expect(spyInvoiceAlert).toBeCalled();
          expect(result).toEqual(invoiceResolved.id);
        });
      });
      describe('otherwise', () => {
        describe('if not found', () => {
          it('throws NotFoundException', async () => {
            try {
              await invoicesService.send(id, await user);
            } catch (error) {
              expect(error).toBeInstanceOf(NotFoundException);
              expect((error as NotFoundException).message).toEqual(
                `Invoice #${id} could not be found.`,
              );
            }
          });
        });
        describe('if not approved', () => {
          it('throws a BadRequestException', async () => {
            invoiceRepository.findOne.mockResolvedValue(await invoice);
            const invoiceResolved = await invoice;
            invoiceResolved.approved = false;
            try {
              await invoicesService.send(id, await user);
            } catch (error) {
              expect(error).toBeInstanceOf(BadRequestException);
              expect((error as BadRequestException).message).toEqual(
                `Invoice ${invoiceResolved.invoiceNo} is not approved yet, you cannot send unapproved invoices`,
              );
            }
          });
        });
      });
    });
    describe('#download', () => {
      const id = 1;
      const user = buildEntityObject<User>({
        partial: true,
        fields: {
          id: 1,
        },
      });
      const invoice = buildEntityObject<Invoice>({
        partial: true,
        fields: {
          id: 1,
          invoiceNo: 'abcd',
          fileData: Buffer.from('test'),
          fileName: 'name',
        },
      });
      describe('if invoice with given id exists', () => {
        it('returns an object with fileData and fileName', async () => {
          invoiceRepository.findOne.mockResolvedValue(await invoice);
          const result = await invoicesService.download(id, await user);
          expect(result).toBeTruthy();
          expect(result.data).toBeInstanceOf(Buffer);
          expect(typeof result.name).toEqual('string');
        });
      });
      describe('otherwise', () => {
        it('throws a NotFoundException', async () => {
          try {
            await invoicesService.download(id, await user);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect((error as NotFoundException).message).toEqual(
              `Invoice #${id} could not be found.`,
            );
          }
        });
      });
    });
  });
});
