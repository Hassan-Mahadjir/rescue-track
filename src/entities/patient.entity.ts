import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { Status } from 'src/enums/status.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';
import { Eligibility } from 'src/enums/eligibility.enum';
import { RunReport } from './run-report.entity';
import { UpdateHistory } from './updateHistory.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nationalID: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dateofBirth: Date;

  @Column({ nullable: true, type: 'enum', enum: Eligibility })
  eligibility: string;

  @Column({ nullable: true, type: 'enum', enum: Nationality })
  nationality: Nationality;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  height: number;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  hospitalId: string;

  @Column()
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

  @Column()
  responsibleUserId: number;

  // Relationship with PatientUpdateHistory
  @OneToMany(() => UpdateHistory, (history) => history.patient)
  updateHistory: UpdateHistory[];

  // Relationship with PatientCareReport
  @OneToMany(() => PatientCareReport, (report) => report.patient)
  patientCareReport: PatientCareReport[];

  // Relationship with RunReport
  @OneToMany(() => RunReport, (report) => report.patient)
  patientRunReport: RunReport[];
}
