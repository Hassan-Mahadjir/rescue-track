import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsNumber()
  @IsOptional()
  newResponsibleID: number; // The ID of the new responsible user
}
