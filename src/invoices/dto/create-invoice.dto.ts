import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { getEnumApiOpts } from '../../commons/utils/utils';
import { RequireContractorIdOrNew } from '../../contractors/contractor.validator';
import { CreateContractorDto } from '../../contractors/dto/create-contractor.dto';
import { Currency, InvoiceCalculationMethod } from '../invoice.type';
import { InvoiceItemDto } from './invoice-item.dto';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  invoiceNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  issuedAt?: Date; //if not provided same as createdAt

  @ApiProperty()
  @IsOptional()
  @IsDate()
  saleDate?: Date; //if not provided same as createdAt

  @ApiProperty()
  @IsDate()
  @IsOptional()
  accountingPeriod: Date; //if not provided same as current month

  @ApiProperty({
    description: getEnumApiOpts(InvoiceCalculationMethod),
    default: InvoiceCalculationMethod.NET,
  })
  @IsEnum(InvoiceCalculationMethod)
  invoiceCalculationMethod: InvoiceCalculationMethod;

  @ApiProperty({ description: getEnumApiOpts(Currency), default: Currency.PLN })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsDate()
  paymentDeadline: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  paidDate?: Date;

  @ApiProperty({ type: [InvoiceItemDto] })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  invoiceItems: InvoiceItemDto[];

  @ApiProperty({
    description:
      'ID of an existing contractor. If new contractor was also provided this takes precedence',
    default: 1,
  })
  @RequireContractorIdOrNew('newContractor', {
    message: 'Contractor ID or new contractor object required',
  })
  contractorId: number;

  @ApiProperty({
    description:
      'Provide if new contractor should be created for this invoice. Skipped if contractorID is provided.',
    type: CreateContractorDto,
  })
  @ValidateNested({ each: true })
  @RequireContractorIdOrNew('contractorId', {
    message: 'Contractor ID or new contractor object required',
  })
  @Type(() => CreateContractorDto)
  newContractor: CreateContractorDto;
}
