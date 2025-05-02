import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Allergy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relationship with PatientCareReport
  @ManyToOne(() => PatientCareReport, (PCR) => PCR.allergies)
  PCR: PatientCareReport;
}
