import { PartialType } from '@nestjs/mapped-types';
import { Treatment } from './create-treatement.dto';

export class UpdateTreatmentDto extends PartialType(Treatment) {}
