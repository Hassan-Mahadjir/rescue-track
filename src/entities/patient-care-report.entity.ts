import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Treatment } from './treatment.entity';
import { User } from './user.entity';
import { Condition } from 'src/enums/condition.enums';
import { UpdateHistory } from './updateHistory.entity';

@Entity()
export class PatientCareReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Condition, default: Condition.STABLE })
  patientCondition: string;

  @Column({ nullable: true })
  initialCondition: string;

  @Column({ nullable: true })
  primarySymptoms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.patientCareReport)
  @JoinColumn()
  patient: Patient;

  // Relationship with PatientUpdateHistory
  @OneToMany(() => UpdateHistory, (history) => history.patientCareReport)
  updateHistory: UpdateHistory[];

  //Relationship with Treatment
  @OneToMany(() => Treatment, (treatment) => treatment.PCR, { cascade: true })
  treatments: Treatment[];

  // Relationship with USER(Who generated the report)
  @ManyToOne(() => User, (user) => user.PCRs)
  @JoinColumn()
  initiatedBy: User;
}
