import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TreatmentDto } from './create-treatement.dto';
import { Condition } from 'src/enums/condition.enums';

export class CreatePatientCareReportDto {
  @IsNumber()
  patientId: number;

  @IsEnum(Condition)
  patientCondition: Condition;

  @IsString()
  initialCondition: string;

  @IsString()
  primarySymptoms: string;

  @IsString()
  notes: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreatmentDto)
  treatments: TreatmentDto[];
}
