import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from 'src/enums/unit.enums';

export class Treatment {
  @IsString()
  name: string;

  @IsNumber()
  dosage: number;

  @Type(() => Date)
  @IsDate()
  givenAt: Date;

  @IsString()
  route: string;

  @IsString()
  result: string;

  @IsEnum(Unit)
  @IsOptional()
  unit: Unit;

  @IsEnum(TreatmentCategory)
  @IsOptional()
  category: TreatmentCategory;
}

export type TreatmentDto = Treatment[];
