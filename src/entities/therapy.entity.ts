import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Therapy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  therapy: string;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.therapies,
  )
  PCR: PatientCareReport;
}
