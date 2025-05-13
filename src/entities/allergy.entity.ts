import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Allergy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relationship with PatientCareReport
  @ManyToMany(() => PatientCareReport, (PCR) => PCR.allergies)
  @JoinTable()
  PCR: PatientCareReport[];
}
