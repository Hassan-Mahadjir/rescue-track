import { PartialType } from '@nestjs/mapped-types';
import { TrumaDto } from './create-truma.dto';

export class UpdateTrumaDto extends PartialType(TrumaDto) {}
