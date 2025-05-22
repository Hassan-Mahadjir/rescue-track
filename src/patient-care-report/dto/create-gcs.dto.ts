import { IsNumber } from 'class-validator';

export class CreateGCSDto {
  @IsNumber()
  E: number;

  @IsNumber()
  V: number;

  @IsNumber()
  M: number;
}
