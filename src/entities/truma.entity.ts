import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Truma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.truma,
  )
  PCR: PatientCareReport;
}
