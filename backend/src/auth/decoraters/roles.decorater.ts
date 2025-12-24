import { SetMetadata } from '@nestjs/common';
import { UserRolesEnumType } from 'src/db/schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRolesEnumType[]) =>
  SetMetadata(ROLES_KEY, roles);
