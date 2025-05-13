import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto, CreateMedicationDto } from './create-item.dto';

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
