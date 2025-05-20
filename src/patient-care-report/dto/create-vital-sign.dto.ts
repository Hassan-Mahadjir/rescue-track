import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { TreatmentDto } from './create-treatement.dto';

export class CreateVitalSignDto {
  @Type(() => Date)
  @IsDate()
  time: Date;

  @IsString()
  T: string;

  @IsString()
  BP: string;

  @IsString()
  pulse: string;

  @IsString()
  resp: string;

  @IsString()
  spO2: string;

  treatments: TreatmentDto;
}
