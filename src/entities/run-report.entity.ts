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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { UpdateHistory } from './updateHistory.entity';
import { PatientCareReport } from './patient-care-report.entity';
import { Server } from 'http';
import { ServerityCode } from 'src/enums/Serverity-code.enums';

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

  @Column({ type: 'enum', enum: ServerityCode, default: ServerityCode.CODE_1 })
  severtiyCode: ServerityCode;

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

  @Column({ type: 'timestamp', nullable: true })
  callReceivedTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  notificationTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrivalTimeAtScense: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrivalTimeAtPatient: Date;

  @Column({ type: 'timestamp', nullable: true })
  departureTime: Date;

  @Column({ nullable: true })
  fromLocation: string;

  @Column({ nullable: true })
  toLocation: string;

  @Column({ nullable: true })
  locationNote: string;

  @Column({ nullable: true })
  ambulanceNumber: string;

  @Column({ nullable: true })
  ambulanceDriver: string;

  @Column({ type: 'timestamp', nullable: true })
  arrivalTimeAtDestination: Date;

  @Column({ type: 'timestamp', nullable: true })
  departureTimeFromDestination: Date;

  @Column()
  notes: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

  // Relationship with Patient
  @ManyToOne(() => Patient, (patient) => patient.patientRunReport, {
    cascade: true,
  })
  @JoinColumn()
  patient: Patient | null;

  @OneToMany(() => UpdateHistory, (history) => history.runReport)
  updateHistory: UpdateHistory[];

  // Relationship with PCR
  @OneToOne(() => PatientCareReport, (PCR) => PCR, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  patientCareReport: PatientCareReport | null;
}
