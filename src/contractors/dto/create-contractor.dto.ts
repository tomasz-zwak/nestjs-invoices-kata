import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  NotEquals,
} from 'class-validator';
import { getEnumApiOpts } from '../../commons/utils/utils';
import { PaymentMethod } from '../../invoices/invoice.type';

export class CreateContractorDto {
  @ApiProperty()
  @IsBoolean()
  @NotEquals(null)
  privatePerson: boolean;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  taxId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  building: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: getEnumApiOpts(PaymentMethod),
    default: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsDate()
  defaultPaymentDeadline: Date;

  @ApiProperty()
  @IsEmail()
  email: string;
}
