import { InputType, PartialType as PartialTypeGql } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from './create-invoice.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
@InputType()
export class UpdateInvoiceDtoGql extends PartialTypeGql(CreateInvoiceDto) {}
