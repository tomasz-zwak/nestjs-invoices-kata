import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Invoice } from '../invoices/entities/invoice.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendNewInvoiceMail(user: User, invoice: Invoice) {
    await this.mailerService.sendMail({
      to: invoice.contractor.email,
      from: 'InvoicesApp',
      subject: 'Masz nową fakturę',
      template: 'new-invoice.hbs',
      context: {
        user: {
          name: 'Test userName',
        },
        invoice,
      },
    });
  }
}
