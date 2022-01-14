import { MailerOptions, TemplateAdapter } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MjmlAdapter implements TemplateAdapter {
  compile(
    mail: any,
    callback: (err?: any, body?: string) => any,
    options: MailerOptions,
  ) {}
}
