import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Unit } from 'src/enums/unit.enums';

export class CreateOrderItemDto {
  @IsNumber()
  quantity: number;

  @IsEnum(Unit)
  unit: Unit;

  @IsNumber()
  @IsOptional()
  medicationId?: number;

  @IsNumber()
  @IsOptional()
  equipmentId?: number;
}
