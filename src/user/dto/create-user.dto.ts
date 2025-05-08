import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsBoolean()
  @IsOptional()
  isOwner?: boolean;
}
