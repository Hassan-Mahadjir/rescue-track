import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class Skin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skin_status: string;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.skin,
  )
  PCR: PatientCareReport;
}
