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
import { TrumaDto } from './create-truma.dto';
import { CreateInjuryMechanismDto } from './create-InjuryMechanim.dto';
import { CreateVitalSignDto } from './create-vital-sign.dto';
import {
  CreatePupilDto,
  CreateRespDto,
  CreateSkinDto,
} from './create-physical.dto';

export class CreatePatientCareReportDto {
  @IsNumber()
  @IsOptional()
  patientId: number;

  @IsOptional()
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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVitalSignDto)
  vitalSigns: CreateVitalSignDto[];

  @ValidateNested()
  @Type(() => CreateMedicalConditionDto)
  medicalConditions: CreateMedicalConditionDto[];

  @ValidateNested()
  @Type(() => CreateAllergyDto)
  allergies: CreateAllergyDto[];

  @ValidateNested()
  @Type(() => TrumaDto)
  truma: TrumaDto[];

  @ValidateNested()
  @Type(() => CreateInjuryMechanismDto)
  injuryMechanism: CreateInjuryMechanismDto[];

  @ValidateNested()
  @Type(() => CreatePupilDto)
  pupils: CreatePupilDto[];

  @ValidateNested()
  @Type(() => CreateSkinDto)
  skins: CreateSkinDto[];

  @ValidateNested()
  @Type(() => CreateRespDto)
  resps: CreateRespDto[];
}
