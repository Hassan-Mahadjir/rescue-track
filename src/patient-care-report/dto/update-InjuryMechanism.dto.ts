import { PartialType } from '@nestjs/mapped-types';
import { CreateInjuryMechanismDto } from './create-InjuryMechanim.dto';

export class UpdateInjuryMechanism extends PartialType(
  CreateInjuryMechanismDto,
) {}
