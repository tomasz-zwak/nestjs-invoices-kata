import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailProcessor } from './mail.processor';
import { QueueModule } from '../queue/queue.module';
import { MjmlAdapter } from './mjml.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService, mjmlAdapter: MjmlAdapter) => ({
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
          adapter: mjmlAdapter,
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService, MjmlAdapter],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.mail'],
        }),
        MailModule,
      ],
    }),
    QueueModule,
  ],
  providers: [MailService, ConfigService, MailProcessor, MjmlAdapter],
  exports: [MailService, MjmlAdapter],
})
export class MailModule {}
