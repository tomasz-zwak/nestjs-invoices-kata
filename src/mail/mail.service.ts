import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { MailData } from '../queue/queue.type';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  invoiceAlert(user: User, invoice: Invoice): MailData {
    return {
      to: invoice.contractor.email,
      from: 'InvoicesApp',
      subject: 'New Invoice',
      template: 'new-invoice.hbs',
      context: {
        user,
        invoice,
      },
    };
  }

  accountConfirmation(user: User): MailData {
    return {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Confirm your mail address',
      template: 'account-confirm.hbs',
      context: { user },
    };
  }

  passwordReset(user: User): MailData {
    return {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Reset your password',
      template: 'password-reset.hbs',
      context: { user },
    };
  }

  accountCreated(user: User): MailData {
    return {
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Administrator created an account for you',
      template: 'account-create.hbs',
      context: { user },
    };
  }

  sendMail(mailData: MailData) {
    this.mailerService.sendMail(mailData);
  }
}
