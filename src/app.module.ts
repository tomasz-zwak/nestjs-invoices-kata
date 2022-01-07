import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ContractorsModule } from './contractors/contractors.module';
import { AuthModule } from './auth/auth.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    DatabaseModule,
    InvoicesModule,
    UserModule,
    ContractorsModule,
    AuthModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
