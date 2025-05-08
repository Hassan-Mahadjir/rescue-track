import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from 'src/enums/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  otpCodeExpiry?: Date;

  otp?: string;

  role?: UserRole;

  isVerified?: boolean;
}
