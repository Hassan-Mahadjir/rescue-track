import { IsString } from 'class-validator';

export class TrumaDto {
  @IsString()
  name: string;
}
