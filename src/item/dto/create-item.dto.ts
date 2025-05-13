import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EquipmentType } from 'src/enums/equipmentType.enums';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from 'src/enums/unit.enums';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  stockQuantity: number;

  @IsString()
  @IsOptional()
  notes: string;
}

export class CreateMedicationDto extends CreateItemDto {
  @IsEnum(TreatmentCategory)
  category: TreatmentCategory;

  @IsString()
  batchNumber: string;

  @IsEnum(Unit)
  unit: Unit;

  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  @IsNumber()
  @IsOptional()
  reorderPoint: number;

  @IsOptional()
  @IsNumber()
  supplierId: number;
}

export class CreateEquipmentDto extends CreateItemDto {
  @IsEnum(EquipmentType)
  category: EquipmentType;

  @IsString()
  serialNumber: string;

  @IsString()
  modelNumber: string;

  @IsString()
  manufacturer: string;

  @Type(() => Date)
  @IsDate()
  purchaseDate: Date;

  @IsNumber()
  warrantyPeriod: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextMaintenanceDate: Date;
}
