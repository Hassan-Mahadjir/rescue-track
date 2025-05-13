import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Status } from 'src/enums/status.enums';

export class CreateOrderDto {
  @IsNumber()
  supplierId: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
