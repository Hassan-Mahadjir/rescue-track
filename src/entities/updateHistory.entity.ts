import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
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

  @Column()
  updatedById: number;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.updateHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patient: Patient;
  // Relationship with PatientCareReport
  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.updateHistory,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  patientCareReport: PatientCareReport;

  // Relationship with run Report
  @ManyToOne(() => RunReport, (report) => report.updateHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  runReport: RunReport;
}
