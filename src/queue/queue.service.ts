import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PdfData } from './queue.type';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue,
    @InjectQueue('pdf') private readonly pdfQueue: Queue,
  ) {}

  enqueueMail(mailData: ISendMailOptions) {
    this.mailQueue.add(mailData);
  }

  enqueuePdf(pdfData: PdfData) {
    this.pdfQueue.add(pdfData);
  }
}
