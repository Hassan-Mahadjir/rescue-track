import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from 'src/enums/unit.enums';

export class Treatment {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsEnum(Unit)
  @IsOptional()
  unit: Unit;

  @IsEnum(TreatmentCategory)
  @IsOptional()
  category: TreatmentCategory;
}

export type TreatmentDto = Treatment[];
