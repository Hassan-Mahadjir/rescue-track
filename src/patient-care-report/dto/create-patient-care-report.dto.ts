import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Treatment, TreatmentDto } from './create-treatement.dto';
import { Condition } from 'src/enums/condition.enums';
import { CreateMedicalConditionDto } from './create-medical-condition.dto';
import { CreateAllergyDto } from './create-allergy.dto';

export class CreatePatientCareReportDto {
  @IsNumber()
  @IsOptional()
  patientId: number;

  @IsNumber()
  runReportId: number;

  @IsEnum(Condition)
  patientCondition: Condition;

  @IsString()
  @IsOptional()
  primaryAssessment: string;

  @IsString()
  @IsOptional()
  secondaryAssessment: string;

  @IsString()
  @IsOptional()
  notes: string;

  @ValidateNested()
  @Type(() => Treatment)
  treatments: TreatmentDto;

  @ValidateNested()
  @Type(() => CreateMedicalConditionDto)
  medicalConditions: CreateMedicalConditionDto[];

  @ValidateNested()
  @Type(() => CreateAllergyDto)
  allergies: CreateAllergyDto[];
}
