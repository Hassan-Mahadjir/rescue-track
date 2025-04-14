import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DispatchPriority } from 'src/enums/dispatchPriority.enum';
import { IncidentCategory } from 'src/enums/incidentCategory.enums';
import { Relationship } from 'src/enums/relationship.enum';
import { TransportStatus } from 'src/enums/transportStatus.emums';

export class CreateRunReportDto {
  @IsOptional()
  @IsString()
  caller?: string;

  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsPhoneNumber() // Optional: adjust based on your country (e.g., @IsPhoneNumber('US'))
  callerPhone?: string;

  @IsEnum(Relationship)
  relationship: Relationship;

  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @IsEnum(DispatchPriority)
  priority: DispatchPriority;

  @IsOptional()
  @IsEnum(TransportStatus)
  transportStatus?: TransportStatus;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @Type(() => Date)
  @IsDate()
  responseTime: Date;

  @Type(() => Date)
  @IsDate()
  arrivalTimeAtScense: Date;

  @Type(() => Date)
  @IsDate()
  arrivalTimeAtPatient: Date;

  @Type(() => Date)
  @IsDate()
  departureTime: Date;

  @IsString()
  @IsNotEmpty()
  notes: string;
}
