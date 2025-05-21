import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class RESP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  RESP: string;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.resp,
  )
  PCR: PatientCareReport;
}
