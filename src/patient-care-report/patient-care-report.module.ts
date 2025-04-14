import { Module } from '@nestjs/common';
import { PatientCareReportService } from './patient-care-report.service';
import { PatientCareReportController } from './patient-care-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Treatment } from 'src/entities/treatment.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from 'src/entities/patient.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PatientCareReport,
      Treatment,
      Profile,
      Patient,
      UpdateHistory,
    ]),
  ],
  controllers: [PatientCareReportController],
  providers: [PatientCareReportService, UserService],
})
export class PatientCareReportModule {}
