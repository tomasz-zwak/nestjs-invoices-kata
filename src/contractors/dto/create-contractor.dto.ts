import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';
import {
  defaultPaymentDeadline,
  getEnumApiOpts,
} from '../../commons/utils/utils';
import { PaymentMethod } from '../../invoices/invoice.type';

@InputType()
export class CreateContractorDto {
  @ApiProperty()
  @IsBoolean()
  @NotEquals(null)
  @Field()
  privatePerson: boolean;

  @ApiProperty()
  @IsString()
  @Field()
  country: string;

  @ApiProperty()
  @IsNumber()
  @Field(() => Int)
  taxId: number;

  @ApiProperty()
  @IsString()
  @Field()
  name: string;

  @ApiProperty()
  @IsString()
  @Field()
  city: string;

  @ApiProperty()
  @IsString()
  @Field()
  street: string;

  @ApiProperty()
  @IsString()
  @Field()
  building: string;

  @ApiProperty()
  @IsString()
  @Field()
  postalCode: string;

  @ApiProperty({
    description: getEnumApiOpts(PaymentMethod),
    default: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    default: defaultPaymentDeadline(),
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date)
  defaultPaymentDeadline?: Date;

  @ApiProperty()
  @IsEmail()
  @Field()
  email: string;
}
