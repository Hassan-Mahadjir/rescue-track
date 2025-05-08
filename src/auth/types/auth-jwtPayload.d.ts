import { Role } from '../enums/role.enums';
import { UserRole } from 'src/enums/user-role.enum';

export type AllowedRoles = Role | UserRole; // Union type for both enums

export type AuthJwtPayload = {
  sub: number;
  role: AllowedRoles; // Support both Role and UserRole
};
