import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class SpecialCircumstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  circumstance: string;

  @ManyToOne(() => PatientCareReport, (report) => report.circumstances)
  PCR: PatientCareReport;
}
