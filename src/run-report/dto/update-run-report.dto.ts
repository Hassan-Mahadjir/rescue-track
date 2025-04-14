import { PartialType } from '@nestjs/mapped-types';
import { CreateRunReportDto } from './create-run-report.dto';

export class UpdateRunReportDto extends PartialType(CreateRunReportDto) {}
