import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../../user/user.type';
import { RolesGuard } from '../roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  return applyDecorators(UseGuards(RolesGuard), SetMetadata(ROLES_KEY, roles));
};
