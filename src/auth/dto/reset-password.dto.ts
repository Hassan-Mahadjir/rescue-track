import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class ResetPasswordDto extends PartialType(CreateUserDto) {
  @IsString()
  resetCode?: string;
}
