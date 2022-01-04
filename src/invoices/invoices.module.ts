import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Contractor } from '../contractors/entities/contractor.entity';
import { Country } from './entities/country.entity';
import { InvoiceItemCategory } from './entities/invoice-item-category.entity';
import { ContractorsService } from '../contractors/contractors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      InvoiceItemCategory,
      Contractor,
      Country,
    ]),
  ],
  providers: [InvoicesService, ContractorsService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
