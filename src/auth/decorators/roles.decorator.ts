import { SetMetadata } from '@nestjs/common';
import { AllowedRoles } from 'src/auth/types/auth-jwtPayload'; // Union of Role and UserRole

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [AllowedRoles, ...AllowedRoles[]]) =>
  SetMetadata(ROLES_KEY, roles);
