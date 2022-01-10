import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { UserPayload } from '../user/user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    let user;
    try {
      user = await this.userService.findOne(payload.email);
    } catch (error) {
      throw new UnauthorizedException('User does not exist.');
    }
    const { email, name, role } = user;
    return {
      email,
      name,
      role,
    };
  }
}
