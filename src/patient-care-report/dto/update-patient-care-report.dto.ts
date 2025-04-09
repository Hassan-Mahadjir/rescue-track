import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientCareReportDto } from './create-patient-care-report.dto';

export class UpdatePatientCareReportDto extends PartialType(CreatePatientCareReportDto) {}
