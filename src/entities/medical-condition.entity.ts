import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
  @ManyToMany(() => PatientCareReport, (PCR) => PCR.medicalConditions)
  @JoinTable()
  PCR: PatientCareReport[];
}
