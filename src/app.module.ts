import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ContractorsModule } from './contractors/contractors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/database.service';
import { loadOrmConfig } from './database/load-orm-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DatabaseService],
      useFactory: async (databaseService: DatabaseService) =>
        loadOrmConfig(databaseService.getConfig()),
    }),
    InvoicesModule,
    UserModule,
    ContractorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
