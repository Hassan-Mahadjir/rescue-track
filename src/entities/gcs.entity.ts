import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class GCS {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  E: number;

  @Column({ default: 0 })
  V: number;

  @Column({ default: 0 })
  M: number;

  @Column()
  total: number;

  @BeforeInsert()
  async calulateTotal() {
    this.total = this.E + this.V + this.M;
  }

  @OneToOne(() => PatientCareReport, (report) => report.gcs)
  PCR: PatientCareReport;
}
