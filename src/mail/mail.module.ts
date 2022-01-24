import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MailProcessor } from './mail.processor';
import { QueueModule } from '../queue/queue.module';
import { MjmlAdapter } from './mjml.adapter';
import { loadMailConfig, MailConfig } from './mail.config';
import { mainModule } from 'process';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (
        mailConfig: ConfigType<typeof MailConfig>,
        mjmlAdapter: MjmlAdapter,
      ) => loadMailConfig(mailConfig, mjmlAdapter),
      inject: [MailConfig.KEY, MjmlAdapter],
      imports: [ConfigModule.forFeature(MailConfig), MailModule],
    }),
    QueueModule,
  ],
  providers: [MailService, ConfigService, MailProcessor, MjmlAdapter],
  exports: [MailService, MjmlAdapter],
})
export class MailModule {}
