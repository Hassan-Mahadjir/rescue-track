import { Module } from '@nestjs/common';
import { PatientCareReportService } from './patient-care-report.service';
import { PatientCareReportController } from './patient-care-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Treatment } from 'src/entities/treatment.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from 'src/entities/patient.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { RunReport } from 'src/entities/run-report.entity';
import { MedicalCondition } from 'src/entities/medical-condition.entity';
import { Allergy } from 'src/entities/allergy.entity';
import { Hospital } from 'src/entities/main/hospital.entity';
import { DatabaseConnectionService } from 'src/database/database.service';
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        PatientCareReport,
        Treatment,
        Patient,
        UpdateHistory,
        RunReport,
        MedicalCondition,
        Allergy,
      ],
      'secondary',
    ),
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
  ],
  controllers: [PatientCareReportController],
  providers: [PatientCareReportService, UserService, DatabaseConnectionService],
})
export class PatientCareReportModule {}
