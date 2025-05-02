import { IsString } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  name: string;
}
