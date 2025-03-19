import {
  IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Nationality } from '../enums/nationality.enums';
import { Gender } from '../enums/gender.enums';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsPhoneNumber()
  phone: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEnum(Nationality)
  @IsOptional()
  nationality: Nationality; // Change from string to Nationality enum

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender; // Change from string to Gender enum

  @Type(() => Date) // Ensures conversion from string to Date
  @IsDate()
  dateofBirth: Date;
}
