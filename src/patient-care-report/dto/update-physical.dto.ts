import { PartialType } from '@nestjs/mapped-types';
import {
  CreatePupilDto,
  CreateRespDto,
  CreateSkinDto,
} from './create-physical.dto';

export class UpdatePupilDto extends PartialType(CreatePupilDto) {}
export class UpdateSkinDto extends PartialType(CreateSkinDto) {}
export class UpdateRESPDto extends PartialType(CreateRespDto) {}
