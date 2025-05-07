import { Module } from '@nestjs/common';
import { RunReportService } from './run-report.service';
import { RunReportController } from './run-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RunReport } from 'src/entities/run-report.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { Patient } from 'src/entities/patient.entity';
import { UserService } from 'src/user/user.service';
import { Profile } from 'src/entities/profile.entity';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, RunReport, UpdateHistory, Patient, Profile, PatientCareReport],
      'secondary',
    ),
  ],
  controllers: [RunReportController],
  providers: [RunReportService, UserService],
})
export class RunReportModule {}
