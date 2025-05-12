import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Status } from 'src/enums/status.enums';
import { SupplierSpecialist } from 'src/enums/supplier-Specialist.enums';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsEnum(SupplierSpecialist)
  @IsOptional()
  Specialist: SupplierSpecialist;

  @IsString()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  contactPerson: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;
}
