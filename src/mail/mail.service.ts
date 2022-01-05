import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(data: { username: string; grossValue: number }) {
    console.log(this.configService.get('MAIL_HOST'));
    await this.mailerService.sendMail({
      to: 't.zwak@selleo.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'new-invoice.hbs',
      context: {
        ...data,
      },
    });
  }
}
