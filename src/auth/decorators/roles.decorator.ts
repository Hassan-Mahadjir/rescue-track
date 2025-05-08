import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enums';
import { UserRole } from 'src/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export type AllowedRoles = Role | UserRole; // Union type for both enums

export const Roles = (...roles: [AllowedRoles, ...AllowedRoles[]]) =>
  SetMetadata(ROLES_KEY, roles);
