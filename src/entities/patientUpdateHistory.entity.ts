import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from './user.entity';

@Entity()
export class PatientUpdateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  updateFields: Record<string, any>;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.updateHistory)
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => User, (user) => user.updateHistory)
  @JoinColumn()
  updatedBy: User;
}
