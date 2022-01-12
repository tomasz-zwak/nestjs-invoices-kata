import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MailData, PdfData } from './queue.type';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue,
    @InjectQueue('pdf') private readonly pdfQueue: Queue,
  ) {}

  enqueueMail(mailData: MailData) {
    this.mailQueue.add(mailData);
  }

  enqueuePdf(pdfData: PdfData) {
    this.pdfQueue.add(pdfData);
  }
}
