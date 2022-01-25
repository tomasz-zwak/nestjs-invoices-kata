import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpServer,
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { InvoicesModule } from '../src/invoices/invoices.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { CreateInvoiceDto } from '../src/invoices/dto/create-invoice.dto';
import {
  Currency,
  InvoiceCalculationMethod,
  MeasureUnit,
} from '../src/invoices/invoice.type';
import { Invoice } from '../src/invoices/entities/invoice.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InvoiceItemCategory } from '../src/invoices/entities/invoice-item-category.entity';
import { buildEntityObject, mockUser } from './utils/entity-mocks';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MockAuthGuard } from './utils/mock-auth.guard';
import { InvoiceApproveDto } from '../src/invoices/dto/invoice-approve.dto';
import { InvoicesService } from '../src/invoices/invoices.service';
import { MailService } from '../src/mail/mail.service';
import { InvoiceItemDto } from '../src/invoices/dto/invoice-item.dto';
import { UpdateInvoiceDto } from '../src/invoices/dto/update-invoice.dto';

describe('[Feature] Invoices - /invoices', () => {
  let app: INestApplication;
  let invoiceRepository: Repository<Invoice>;
  let invoiceItemCategoryRepository: Repository<InvoiceItemCategory>;
  let httpServer: HttpServer;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        InvoicesModule,
        AuthModule,
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 5432,
          username: 'root',
          password: 'admin',
          database: 'invoicesAppTest',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    invoiceRepository = app.get<Repository<Invoice>>(
      getRepositoryToken(Invoice),
    );
    invoiceItemCategoryRepository = app.get<Repository<InvoiceItemCategory>>(
      getRepositoryToken(InvoiceItemCategory),
    );
    const connection: Connection = app.get<Connection>(Connection);
    queryRunner = connection.createQueryRunner();
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const user = await mockUser;
    await userRepository.save(user);
  });

  it('Get item categories [GET /itemCategories]', async () => {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await queryRunner.query(`TRUNCATE invoice_item_category;`);
    await invoiceItemCategoryRepository.save(
      await buildEntityObject<InvoiceItemCategory>({
        partial: true,
        fields: {
          name: 'Sprzedaz towarów PARAGONOWA',
          symbol: 'Sprzedaz towarów PARAGONOWA',
          typeNo: '700-11',
        },
      }),
    );
    const { body } = await request(httpServer)
      .get('/invoices/itemCategories')
      .expect(HttpStatus.OK);
    expect(body).toBeTruthy();
    expect(body).toBeInstanceOf(Array);
  });
  it('Get all [GET /]', async () => {
    const { body: invoices } = await request(httpServer)
      .get('/invoices')
      .expect(HttpStatus.OK);
    expect(invoices).toBeTruthy();
    expect(invoices).toBeInstanceOf(Array);
  });
  it('Get one [GET /:id]', async () => {
    const id = 1;
    const { body: invoice } = await request(httpServer)
      .get(`/invoices/${id}`)
      .expect(HttpStatus.OK);
    expect(invoice.id).toEqual(id);
  });
  it('Get items [GET /:id/invoiceItems]', async () => {
    const id = 1;
    const { body: invoiceItems } = await request(httpServer)
      .get(`/invoices/${id}/invoiceItems`)
      .expect(HttpStatus.OK);
    expect(invoiceItems).toBeInstanceOf(Array);
    expect(invoiceItems).toHaveLength(1);
    expect(invoiceItems?.[0]?.id).toEqual(1);
  });
  it('Approve [PATCH /:id/approve]', async () => {
    const invoicesService = app.get<InvoicesService>(InvoicesService);
    const findOneSpy = jest.spyOn(invoicesService, 'findOne');
    const genPdfSpy = jest.spyOn<any, any>(invoicesService, 'generatePdf');
    const approveDto: InvoiceApproveDto = {
      approve: true,
    };
    const id = 1;
    const { text: message } = await request(httpServer)
      .patch(`/invoices/${id}/approve`)
      .send(approveDto)
      .expect(HttpStatus.OK);
    const approvedInvoice = await invoiceRepository.findOne(id);
    expect(message).toEqual(`Invoice ${approvedInvoice.invoiceNo} approved.`);
    expect(approvedInvoice.approved).toEqual(true);
    expect(findOneSpy).toHaveBeenCalled();
    expect(genPdfSpy).toHaveBeenCalled();
  });
  it('Send one [GET /:id/send]', async () => {
    const invoicesService = app.get<InvoicesService>(InvoicesService);
    const mailService = app.get<MailService>(MailService);
    const findOneSpy = jest.spyOn(invoicesService, 'findOne');
    const invoiceAlertSpy = jest
      .spyOn(mailService, 'invoiceAlert')
      .mockImplementation(() => {
        return {
          data: jest.fn(),
          send: jest.fn(),
        };
      });
    const id = 1;
    const { text: invoiceId } = await request(httpServer)
      .get(`/invoices/${id}/send`)
      .expect(HttpStatus.OK);
    expect(+invoiceId).toEqual(id);
    expect(findOneSpy).toHaveBeenCalled();
    expect(invoiceAlertSpy).toHaveBeenCalled();
  });
  it('Download one [GET /:id/download]', async () => {
    const invoicesService = app.get<InvoicesService>(InvoicesService);
    const findOneSpy = jest.spyOn(invoicesService, 'findOne');
    const id = 1;
    await invoiceRepository.update(
      { id: id },
      { fileData: Buffer.from('test'), fileName: 'test' },
    );
    const { body: pdfResponse } = await request(httpServer)
      .get(`/invoices/${id}/download`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', 'application/pdf')
      .expect('Content-Disposition', `attachment; filename="test"`);
    expect(pdfResponse).toEqual(Buffer.from('test'));
    expect(findOneSpy).toHaveBeenCalled();
  });
  it('Create one [POST /]', async () => {
    const invoice: CreateInvoiceDto = {
      comment: 'comment',
      currency: Currency.PLN,
      invoiceCalculationMethod: InvoiceCalculationMethod.NET,
      invoiceItems: [
        {
          amount: 100,
          description: 'abc',
          vatRate: 0.23,
          discount: 0,
          measureUnit: MeasureUnit.PIECE,
          price: 5,
          categoryId: 0,
        },
      ],
    };
    const { body } = await request(httpServer)
      .post('/invoices')
      .send(invoice)
      .expect(HttpStatus.CREATED);
    const calculatedInvoiceItem = expect.objectContaining({
      amount: 100,
      description: 'abc',
      discount: 0,
      grossValue: '615.00',
      price: 5,
      vatRate: 0.23,
      vatValue: '115.00',
    });
    const expected = expect.objectContaining({
      ...invoice,
      invoiceItems: [calculatedInvoiceItem],
    });
    const invoiceFromDb = await invoiceRepository.findOne(body.id);
    expect(invoiceFromDb).toBeDefined();
    expect(body).toEqual(expected);
  });
  it('Update one [PATCH /:id]', async () => {
    const invoiceDto: CreateInvoiceDto = {
      comment: 'comment',
      currency: Currency.PLN,
      invoiceCalculationMethod: InvoiceCalculationMethod.NET,
      invoiceItems: [
        {
          amount: 100,
          description: 'abc',
          vatRate: 0.23,
          discount: 0,
          measureUnit: MeasureUnit.PIECE,
          price: 5,
          categoryId: 0,
        },
      ],
    };
    const invoicesService = app.get<InvoicesService>(InvoicesService);
    const invoice = await invoicesService.create(invoiceDto, await mockUser);
    const id = invoice.id;
    const updateDto: UpdateInvoiceDto = {
      comment: 'new Comment',
      currency: Currency.USD,
    };
    const { body: updatedInvoice } = await request(httpServer)
      .patch(`/invoices/${id}`)
      .send(updateDto)
      .expect(HttpStatus.OK);
    expect(updatedInvoice.id).toEqual(id);
    expect(updatedInvoice.comment).toEqual(updateDto.comment);
    expect(updatedInvoice.currency).toEqual(updateDto.currency);
  });

  it('Delete one [DELETE /:id]', async () => {
    const invoiceDto: CreateInvoiceDto = {
      comment: 'comment',
      currency: Currency.PLN,
      invoiceCalculationMethod: InvoiceCalculationMethod.NET,
      invoiceItems: [
        {
          amount: 100,
          description: 'abc',
          vatRate: 0.23,
          discount: 0,
          measureUnit: MeasureUnit.PIECE,
          price: 5,
          categoryId: 0,
        },
      ],
    };
    const invoicesService = app.get<InvoicesService>(InvoicesService);
    const invoice = await invoicesService.create(invoiceDto, await mockUser);
    const id = invoice.id;
    const { body: deletedInvoice } = await request(httpServer)
      .delete(`/invoices/${id}`)
      .expect(HttpStatus.OK);
    expect(deletedInvoice.id).toBeFalsy();
    try {
      await invoicesService.findOne(id, await mockUser);
    } catch (error) {
      expect((error as NotFoundException).message).toBe(
        `Invoice #${id} could not be found.`,
      );
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
