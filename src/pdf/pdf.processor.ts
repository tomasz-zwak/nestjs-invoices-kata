import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Exception } from 'handlebars';
import { Repository } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';
import { MailService } from '../mail/mail.service';
import { PdfData } from '../queue/queue.type';
import { PdfService } from './pdf.service';

@Processor('pdf')
export class PdfProcessor {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) {}
  @Process()
  async processPdf(job: Job<PdfData>) {
    const { invoice, contractor, user } = job.data.data;
    if (!invoice || !contractor || !user)
      throw new Exception('Data incomplete');
    const pdf = await this.pdfService.generatePdf(job.data.template, {
      invoice,
      contractor,
      user,
    });
    await this.invoiceRepository.update(
      { id: invoice.id },
      {
        fileName: pdf.name,
        fileData: pdf.data,
      },
    );
    this.mailService
      .invoiceAlert({
        invoice,
        contractor,
        user,
      })
      .send();
  }
}
