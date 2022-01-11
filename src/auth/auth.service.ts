import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as Bcrypt from 'bcryptjs';
import { UserPayload } from '../user/user.type';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    let user, passwordMatch;
    try {
      user = await this.userService.findOne(email);
      passwordMatch = await Bcrypt.compare(pass, user.passwordHash);
      if (!passwordMatch) throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException('Incorrect username or password.');
    }
    if (!user.active) {
      throw new UnauthorizedException('Activate your account first.');
    }
    if (user.passwordExpired) {
      throw new UnauthorizedException('Password expired.');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: User) {
    const { email, name, role } = user;
    const payload: UserPayload = { email, name, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
