import { Module } from '@nestjs/common';
import { RunReportService } from './run-report.service';
import { RunReportController } from './run-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { RunReport } from 'src/entities/run-report.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { Patient } from 'src/entities/patient.entity';
import { UserService } from 'src/user/user.service';
import { Profile } from 'src/entities/main/profile.entity';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Hospital } from 'src/entities/main/hospital.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [RunReport, UpdateHistory, Patient, PatientCareReport],
      'secondary',
    ),
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
  ],
  controllers: [RunReportController],
  providers: [RunReportService, UserService],
})
export class RunReportModule {}
