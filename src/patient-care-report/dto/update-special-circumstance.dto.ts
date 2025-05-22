import { PartialType } from '@nestjs/mapped-types';
import { CreateCirumstanceDto } from './create-special-circumstance.dto';

export class UpdateCirumstanceDto extends PartialType(CreateCirumstanceDto) {}
