import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';
import { PatientCareReport } from './patient-care-report.entity';
import { RunReport } from './run-report.entity';

@Entity()
export class UpdateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  updateFields: Record<string, any>;

  @CreateDateColumn()
  updatedAt: Date;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.updateHistory)
  @JoinColumn()
  patient: Patient;

  // Relationship with User
  // This is the user who made the update
  @ManyToOne(() => User, (user) => user.updateHistory, {
    nullable: false,
  })
  @JoinColumn()
  updatedBy: User;

  // Relationship with PatientCareReport
  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.updateHistory,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  patientCareReport: PatientCareReport;

  // Relationship with run Report
  @ManyToOne(() => RunReport, (report) => report.updateHistory)
  @JoinColumn()
  runReport: RunReport;
}
