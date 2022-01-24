import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process()
  processMail(job: Job<ISendMailOptions>) {
    this.mailService.sendMail(job.data);
  }
}
