import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Pupil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  PHSY: string;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.pupil,
  )
  PCR: PatientCareReport;
}
