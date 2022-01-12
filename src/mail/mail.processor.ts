import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailData } from '../queue/queue.type';
import { MailService } from './mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process()
  processMail(job: Job<MailData>) {
    this.mailService.sendMail(job.data);
  }
}
