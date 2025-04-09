import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from 'src/enums/unit.enums';

export class TreatmentDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsEnum(Unit)
  unit: Unit;

  @IsEnum(TreatmentCategory)
  category: TreatmentCategory;
}
