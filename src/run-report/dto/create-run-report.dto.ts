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
import { ServerityCode } from 'src/enums/Serverity-code.enums';

export class CreateRunReportDto {
  @IsOptional()
  @IsString()
  caller?: string;

  @IsOptional()
  @IsPhoneNumber()
  callerPhone?: string;

  @IsEnum(Relationship)
  relationship: Relationship;

  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @IsEnum(DispatchPriority)
  priority: DispatchPriority;

  @IsOptional()
  @IsEnum(ServerityCode)
  severtiyCode?: ServerityCode;

  @IsOptional()
  @IsEnum(TransportStatus)
  transportStatus?: TransportStatus;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  responseTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  callReceivedTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  notificationTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalTimeAtScense?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalTimeAtPatient?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureTime?: Date;

  @IsOptional()
  @IsString()
  fromLocation?: string;

  @IsOptional()
  @IsString()
  toLocation?: string;

  @IsOptional()
  @IsString()
  locationNote?: string;

  @IsOptional()
  @IsString()
  ambulanceNumber?: string;

  @IsOptional()
  @IsString()
  ambulanceDriver?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalTimeAtDestination?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  departureTimeFromDestination?: Date;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsOptional()
  @IsNumber()
  patientId: number;
}
