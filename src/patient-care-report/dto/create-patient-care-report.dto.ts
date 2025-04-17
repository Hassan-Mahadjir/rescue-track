import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TreatmentDto } from './create-treatement.dto';
import { Condition } from 'src/enums/condition.enums';

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
  initialCondition: string;

  @IsString()
  @IsOptional()
  primarySymptoms: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreatmentDto)
  treatments: TreatmentDto[];
}
