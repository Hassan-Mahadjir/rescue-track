import { DispatchPriority } from 'src/enums/dispatchPriority.enum';
import { IncidentCategory } from 'src/enums/incidentCategory.enums';
import { Relationship } from 'src/enums/relationship.enum';
import { TransportStatus } from 'src/enums/transportStatus.emums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { UpdateHistory } from './updateHistory.entity';

@Entity()
export class RunReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  caller: string;

  @Column({ nullable: true })
  callerPhone: string;

  @Column({ type: 'enum', enum: Relationship })
  relationship: string;

  @Column({ type: 'enum', enum: IncidentCategory })
  category: string;

  @Column({ type: 'enum', enum: DispatchPriority })
  priority: string;

  @Column({
    type: 'enum',
    enum: TransportStatus,
    default: TransportStatus.TRANSPORTED,
  })
  transportStatus: string;

  @Column({ type: 'float', nullable: true })
  mileage: number;

  @Column({ type: 'timestamp', nullable: true })
  responseTime: Date;

  @Column({ type: 'timestamp' })
  arrivalTimeAtScense: Date;

  @Column({ type: 'timestamp' })
  arrivalTimeAtPatient: Date;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column()
  notes: string;

  @CreateDateColumn()
  createAt: Date;

  //   relationship with USER (who create run-report)
  @ManyToOne(() => User, (user) => user.runReports)
  @JoinColumn()
  initiatedBy: User;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.patientRunReport)
  @JoinColumn()
  patient: Patient;

  @OneToMany(() => UpdateHistory, (history) => history.runReport)
  updateHistory: UpdateHistory[];
}
