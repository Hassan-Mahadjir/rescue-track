import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateDatabaseDto {
  @IsString()
  name: string;

  @IsString()
  databaseUrl: string;
}
