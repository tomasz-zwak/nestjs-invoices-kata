import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { mockUser } from './entity-mocks';

export class MockAuthGuard {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    req.user = await mockUser;
    return req;
  }
}
