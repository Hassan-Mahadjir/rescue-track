import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { TreatmentDto } from './create-treatement.dto';

export class CreatePatientCareReportDto {
  @IsNumber()
  patientId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreatmentDto)
  treatments: TreatmentDto[];
}
