import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class InjuryMechanism {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  mechanism: string;

  @Column({ nullable: true, default: null })
  height: number;

  @ManyToOne(
    () => PatientCareReport,
    (patientCareReport) => patientCareReport.injuryMechanism,
  )
  PCR: PatientCareReport;
}
