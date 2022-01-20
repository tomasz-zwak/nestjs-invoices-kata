import { Field, Float, InputType } from '@nestjs/graphql';
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

@InputType()
export class CreateInvoiceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  invoiceNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  issuedAt?: Date; //if not provided same as createdAt

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  saleDate?: Date; //if not provided same as createdAt

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  accountingPeriod?: Date; //if not provided same as current month

  @ApiProperty({
    description: getEnumApiOpts(InvoiceCalculationMethod),
    default: InvoiceCalculationMethod.NET,
  })
  @IsEnum(InvoiceCalculationMethod)
  @Field(() => InvoiceCalculationMethod)
  invoiceCalculationMethod: InvoiceCalculationMethod;

  @ApiProperty({ description: getEnumApiOpts(Currency), default: Currency.PLN })
  @IsEnum(Currency)
  @Field(() => Currency)
  currency: Currency;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  comment?: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  paymentDeadline?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  paidAmount?: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  paidDate?: Date;

  @ApiProperty({ type: [InvoiceItemDto] })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @Field(() => [InvoiceItemDto])
  invoiceItems: InvoiceItemDto[];

  @ApiProperty({
    description:
      'ID of an existing contractor. If new contractor was also provided this takes precedence',
    default: 1,
  })
  @RequireContractorIdOrNew('newContractor', {
    message: 'Contractor ID or new contractor object required',
  })
  @Field({ nullable: true })
  contractorId?: number;

  @ApiProperty({
    description:
      'Provide if new contractor should be created for this invoice. Skipped if contractorID is provided.',
    type: CreateContractorDto,
  })
  @ValidateNested()
  @RequireContractorIdOrNew('contractorId', {
    message: 'Contractor ID or new contractor object required',
  })
  @Type(() => CreateContractorDto)
  @Field(() => CreateContractorDto, { nullable: true })
  newContractor?: CreateContractorDto;
}
