import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { getEnumApiOpts } from '../../commons/utils/utils';
import { MeasureUnit } from '../invoice.type';
import { IsPercentage } from '../validators/contractor.validator';

export class InvoiceItemDto {
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({
    description: getEnumApiOpts(MeasureUnit),
    default: MeasureUnit.PIECE,
  })
  @IsEnum(MeasureUnit)
  measureUnit: MeasureUnit;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPercentage()
  discount: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPercentage()
  vatRate: number;
}
