import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import {
  MailAlertTemplateData,
  MailUserAccountTemplateData,
} from './mail.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly queueService: QueueService,
  ) {}

  invoiceAlert(mailData: MailAlertTemplateData) {
    const data = {
      to: mailData.contractor.email,
      from: 'InvoicesApp',
      subject: 'New Invoice',
      template: 'new-invoice',
      context: {
        user: mailData.user,
        invoice: mailData.invoice,
      },
    };
    return this.mailHandlers(data);
  }

  accountConfirmation(mailData: MailUserAccountTemplateData) {
    const { user } = mailData;
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Confirm your mail address',
      template: 'account-confirm',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  passwordReset(mailData: MailUserAccountTemplateData) {
    const { user } = mailData;
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Reset your password',
      template: 'password-reset',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  accountCreated(mailData: MailUserAccountTemplateData) {
    const { user } = mailData;
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Administrator created an account for you',
      template: 'account-create',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  sendMail(mailData: ISendMailOptions) {
    this.mailerService.sendMail(mailData);
  }

  private mailHandlers(data: ISendMailOptions) {
    return {
      data: () => data,
      send: () => {
        this.queueService.enqueueMail(data);
      },
    };
  }
}
