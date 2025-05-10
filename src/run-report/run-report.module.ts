import { Module } from '@nestjs/common';
import { RunReportService } from './run-report.service';
import { RunReportController } from './run-report.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';
import { DatabaseConnectionService } from 'src/database/database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { RunReport } from 'src/entities/run-report.entity';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { Hospital } from 'src/entities/main/hospital.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    TypeOrmModule.forFeature([Patient, UpdateHistory, RunReport], 'secondary'),
    UserModule,
    DatabaseModule,
  ],
  controllers: [RunReportController],
  providers: [RunReportService, DatabaseConnectionService],
  exports: [RunReportService],
})
export class RunReportModule {}
