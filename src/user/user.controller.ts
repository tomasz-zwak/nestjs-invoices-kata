import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Role } from './user.type';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  profile(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Get()
  confirm(@Query('confirmationId') confirmationId: string) {
    return this.userService.confirm(confirmationId);
  }

  @Roles(Role.ADMIN)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Public()
  @Post('resetPassword')
  async resetPassword(
    @Body('password') password: string,
    @Body('email') email: string,
    @Query('passwordResetId') passwordResetId: string,
  ) {
    if (email) return await this.userService.getPasswordResetId(email);
    if (!password || !passwordResetId) throw new BadRequestException();
    return await this.userService.resetPassword(password, passwordResetId);
  }
}
