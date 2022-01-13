import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Role } from '../user.type';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsString()
  accountNumber: string;
}
