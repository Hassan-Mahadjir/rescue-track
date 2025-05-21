import { IsString } from 'class-validator';

export class CreateTherapyDto {
  @IsString()
  therapy: string;
}
