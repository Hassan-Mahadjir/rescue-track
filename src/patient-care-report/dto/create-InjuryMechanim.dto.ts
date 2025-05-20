import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInjuryMechanismDto {
  @IsString()
  mechanism: string;

  @IsOptional()
  @IsNumber()
  height: number;
}
