import { IsString } from 'class-validator';

export class CreatePupilDto {
  @IsString()
  PHSY: string;
}
export class CreateSkinDto {
  @IsString()
  skin_status: string;
}
export class CreateRespDto {
  @IsString()
  RESP: string;
}
