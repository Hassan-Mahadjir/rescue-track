import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { Status } from 'src/enums/status.enums';

export class CreatePatientDto {
  @IsString()
  nationalID: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(Gender)
  gender: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @Type(() => Date)
  @IsDate()
  dateofBirth: Date;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsEnum(Status)
  status: string;

  @IsEnum(Nationality)
  nationality: string;
}
