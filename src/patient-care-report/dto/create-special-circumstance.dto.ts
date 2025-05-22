import { IsString } from 'class-validator';

export class CreateCirumstanceDto {
  @IsString()
  circumstance: string;
}
