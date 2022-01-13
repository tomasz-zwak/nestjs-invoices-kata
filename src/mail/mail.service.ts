import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { QueueService } from '../queue/queue.service';
import { MailData } from '../queue/queue.type';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly queueService: QueueService,
  ) {}

  invoiceAlert(user: User, invoice: Invoice) {
    const data = {
      to: invoice.contractor.email,
      from: 'InvoicesApp',
      subject: 'New Invoice',
      template: 'new-invoice.hbs',
      context: {
        user,
        invoice,
      },
    };
    return this.mailHandlers(data);
  }

  accountConfirmation(user: User) {
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Confirm your mail address',
      template: 'account-confirm.hbs',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  passwordReset(user: User) {
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Reset your password',
      template: 'password-reset.hbs',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  accountCreated(user: User) {
    const data = {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Administrator created an account for you',
      template: 'account-create.hbs',
      context: { user },
    };
    return this.mailHandlers(data);
  }

  sendMail(mailData: MailData) {
    this.mailerService.sendMail(mailData);
  }

  private mailHandlers(data: MailData) {
    return {
      data: () => data,
      send: () => {
        this.queueService.enqueueMail(data);
      },
    };
  }
}
