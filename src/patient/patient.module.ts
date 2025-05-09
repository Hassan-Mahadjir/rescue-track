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

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, UpdateHistory], 'secondary'),
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
  ],
  controllers: [PatientController],
  providers: [PatientService, UserService],
  exports: [PatientService],
})
export class PatientModule {}
