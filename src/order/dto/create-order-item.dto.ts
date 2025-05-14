import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  medicationId?: number;

  @IsNumber()
  @IsOptional()
  equipmentId?: number;
}
