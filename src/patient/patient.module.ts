import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { UserService } from 'src/user/user.service';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { Hospital } from 'src/entities/main/hospital.entity';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseConnectionService } from 'src/database/database.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, UpdateHistory], 'secondary'),
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    DatabaseModule,
  ],
  controllers: [PatientController],
  providers: [PatientService, UserService, DatabaseConnectionService],
  exports: [PatientService],
})
export class PatientModule {}
