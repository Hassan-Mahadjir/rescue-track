import { IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  email: string;
}
