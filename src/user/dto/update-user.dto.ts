import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/auth/enums/role.enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  otpCodeExpiry?: Date;

  otp?: string;

  role?: Role;

  isVerified?: boolean;
}
