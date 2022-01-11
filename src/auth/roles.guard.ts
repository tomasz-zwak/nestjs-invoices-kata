import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role, UserPayload } from '../user/user.type';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<Role>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;
    return role === user.role;
  }
}
