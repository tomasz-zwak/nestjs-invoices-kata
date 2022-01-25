import { Module } from '@nestjs/common';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ContractorsModule } from './contractors/contractors.module';
import { AuthModule } from './auth/auth.module';
import { PdfModule } from './pdf/pdf.module';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi';

@Module({
  imports: [
    DatabaseModule,
    InvoicesModule,
    UserModule,
    ContractorsModule,
    AuthModule,
    PdfModule,
    MailModule,
    QueueModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.test', '.env'],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string(),
        BULL_HOST: Joi.string(),
        BULL_PORT: Joi.string(),
        DATABASE_TYPE: Joi.string(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.string(),
        DATABASE_USER: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_LOGGING: Joi.string(),
        MAIL_HOST: Joi.string(),
        MAIL_PORT: Joi.string(),
        MAIL_USER: Joi.string(),
        MAIL_PASS: Joi.string(),
        MAIL_FROM: Joi.string(),
      }),
    }),
  ],
})
export class AppModule {}
