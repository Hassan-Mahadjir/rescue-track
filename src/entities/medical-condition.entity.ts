import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class MedicalCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relationship with PatientCareReport
  @ManyToOne(() => PatientCareReport, (PCR) => PCR.medicalConditions)
  @JoinColumn()
  PCR: PatientCareReport;
}
