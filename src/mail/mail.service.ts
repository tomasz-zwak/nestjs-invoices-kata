import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async newInvoice(user: User, invoice: Invoice) {
    await this.mailerService.sendMail({
      to: invoice.contractor.email,
      from: 'InvoicesApp',
      subject: 'New Invoice',
      template: 'new-invoice.hbs',
      context: {
        user,
        invoice,
      },
    });
  }

  async accountConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Confirm your mail address',
      template: 'account-confirm.hbs',
      context: { user },
    });
  }

  async passwordReset(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Reset your password',
      template: 'password-reset.hbs',
      context: { user },
    });
  }

  async accountCreated(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'InvoicesApp',
      subject: 'Administrator created an account for you',
      template: 'account-create.hbs',
      context: { user },
    });
  }
}
