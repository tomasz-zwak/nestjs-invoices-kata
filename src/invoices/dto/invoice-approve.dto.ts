import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

@InputType()
export class InvoiceApproveDto {
  @ApiProperty({ description: 'Used to set approved invoice status' })
  @IsBoolean()
  @Field({ description: 'Used to set approved invoice status' })
  approve: boolean;
}
