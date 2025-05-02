import { IsString } from 'class-validator';

export class CreateMedicalConditionDto {
  @IsString()
  name: string;
}
