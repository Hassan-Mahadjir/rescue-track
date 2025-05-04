import { Role } from '../enums/role.enums';

export type AuthJwtPayload = {
  sub: number;
  role: Role;
};
