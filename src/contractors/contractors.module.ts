import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor } from './entities/contractor.entity';
import { ContractorsController } from './contractors.controller';
import { ContractorsService } from './contractors.service';
import { Country } from '../invoices/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contractor, Country])],
  controllers: [ContractorsController],
  providers: [ContractorsService],
})
export class ContractorsModule {}
