import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { PatientUpdateHistory } from 'src/entities/patientUpdateHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User, Profile, PatientUpdateHistory]),
  ],
  controllers: [PatientController],
  providers: [PatientService, UserService],
  exports: [PatientService],
})
export class PatientModule {}
