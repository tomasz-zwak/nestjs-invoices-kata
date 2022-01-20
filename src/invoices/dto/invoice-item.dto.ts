import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { getEnumApiOpts } from '../../commons/utils/utils';
import { MeasureUnit } from '../invoice.type';
import { IsPercentage } from '../validators/contractor.validator';

@InputType()
export class InvoiceItemDto {
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Field(() => Float)
  amount: number;

  @ApiProperty({
    description: getEnumApiOpts(MeasureUnit),
    default: MeasureUnit.PIECE,
  })
  @IsEnum(MeasureUnit)
  @Field(() => MeasureUnit)
  measureUnit: MeasureUnit;

  @ApiProperty()
  @IsNumber()
  @Field(() => Int)
  categoryId: number;

  @ApiProperty()
  @IsString()
  @Field()
  description: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Field(() => Float)
  price: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPercentage()
  @Field(() => Float)
  discount: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPercentage()
  @Field(() => Float)
  vatRate: number;
}
