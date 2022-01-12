import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UniqueExceptionFilter } from './database/unique-exception.filter';
import { ExpressAdapter as BullExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { Queue } from 'bull';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new UniqueExceptionFilter());
  const mailQueue = app.get<Queue>('BullQueue_mail');
  const pdfQueue = app.get<Queue>('BullQueue_pdf');

  const serverAdapter = new BullExpressAdapter();

  createBullBoard({
    queues: [new BullAdapter(mailQueue), new BullAdapter(pdfQueue)],
    serverAdapter: serverAdapter,
  });

  serverAdapter.setBasePath('/admin/queues');
  app.use('/admin/queues', serverAdapter.getRouter());

  const options = new DocumentBuilder()
    .setTitle('InvoicesApp')
    .setDescription('Invoice application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(3000);
}
bootstrap();
