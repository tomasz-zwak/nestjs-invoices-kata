import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as Bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { UserPayload } from '../user/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect username or password.');
    }
    if (user && (await Bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      this.canLogIn(user);
      return result;
    } else {
      if (!user) {
        throw new UnauthorizedException('Incorrect username or password.');
      }
    }
  }

  async login(user: any) {
    const { email, name, role } = user;
    const payload: UserPayload = { email, name, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private canLogIn(user: User) {
    if (!user.active) {
      throw new UnauthorizedException('Activate your account first.');
    }
    if (user.passwordExpired) {
      throw new UnauthorizedException('Password expired.');
    }
  }
}
