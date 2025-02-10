import { Role } from '../enums/role.enums';

export type CurrentUser = {
  id: number;
  role: Role;
};
