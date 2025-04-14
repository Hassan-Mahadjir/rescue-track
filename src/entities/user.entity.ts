import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums/role.enums';
import { Profile } from './profile.entity';
import { Patient } from './patient.entity';
import { PatientCareReport } from './patient-care-report.entity';
import { RunReport } from './run-report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'text' })
  hashedRefreshToken: string | null;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ nullable: true })
  resetCodeExpiry: Date;

  // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // Relationship with PATIENT
  @OneToMany(() => Patient, (patient) => patient.responsible)
  patients: Patient[];

  // Relationship with PATIENT UPDATE HISTORY
  @OneToMany(() => Patient, (patient) => patient.updateHistory)
  updateHistory: Patient[];

  // Relationship with PCR(Pateint Care Report)
  @OneToMany(() => PatientCareReport, (PCR) => PCR.initiatedBy)
  PCRs: PatientCareReport;

  // Relationship with Run Report
  @OneToMany(() => RunReport, (run) => run.initiatedBy)
  runReports: RunReport;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
