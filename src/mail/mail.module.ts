import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailProcessor } from './mail.processor';
import { QueueModule } from '../queue/queue.module';
import { MjmlAdapter } from './mjml.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new MjmlAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.mail'],
        }),
      ],
    }),
    QueueModule,
  ],
  providers: [MailService, ConfigService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
