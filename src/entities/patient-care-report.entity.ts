import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { PatientUpdateHistory } from './patientUpdateHistory.entity';
import { Treatment } from './treatment.entity';
import { User } from './user.entity';

@Entity()
export class PatientCareReport {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.patientCareReport)
  @JoinColumn()
  patient: Patient;

  // Relationship with PatientUpdateHistory
  @OneToMany(
    () => PatientUpdateHistory,
    (patientUpdateHistory) => patientUpdateHistory.patientCareReport,
  )
  updateHistory: PatientUpdateHistory[];

  //Relationship with Treatment
  @OneToMany(() => Treatment, (treatment) => treatment.PCR, { cascade: true })
  treatments: Treatment[];

  // Relationship with USER(Who generated the report)
  @ManyToOne(() => User, (user) => user.PCRs)
  @JoinColumn()
  initiatedBy: User;
}
