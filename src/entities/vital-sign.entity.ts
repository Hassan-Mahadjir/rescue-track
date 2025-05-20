import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Treatment } from './treatment.entity';
import { PatientCareReport } from './patient-care-report.entity';

@Entity()
export class VitalSign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column()
  T: string;

  @Column()
  BP: string;

  @Column()
  pulse: string;

  @Column()
  resp: string;

  @Column()
  spO2: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Treatment, (treatment) => treatment.vitalSign, {
    nullable: true,
  })
  treatments: Treatment[];

  @ManyToOne(() => PatientCareReport, (PCR) => PCR.vitalSign, {
    cascade: true,
    nullable: true,
  })
  PCR: PatientCareReport;
}
