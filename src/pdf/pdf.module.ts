import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';
import { MailModule } from '../mail/mail.module';
import { QueueModule } from '../queue/queue.module';
import { PdfProcessor } from './pdf.processor';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), MailModule, QueueModule],
  providers: [PdfService, PdfProcessor],
  exports: [PdfService],
})
export class PdfModule {}
