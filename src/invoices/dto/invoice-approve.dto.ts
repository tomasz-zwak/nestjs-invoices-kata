import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class InvoiceApproveDto {
  @ApiProperty({ description: 'Used to set approved invoice status' })
  @IsBoolean()
  approve: boolean;
}
