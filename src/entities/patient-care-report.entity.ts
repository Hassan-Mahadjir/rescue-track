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
import { Treatment } from './treatment.entity';
import { Condition } from 'src/enums/condition.enums';
import { UpdateHistory } from './updateHistory.entity';
import { RunReport } from './run-report.entity';
import { MedicalCondition } from './medical-condition.entity';
import { Allergy } from './allergy.entity';

@Entity()
export class PatientCareReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Condition, default: Condition.STABLE })
  patientCondition: string;

  @Column({ type: 'text', nullable: true })
  primaryAssessment: string;

  @Column({ type: 'text', nullable: true })
  secondaryAssessment: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  hospitalId: string;

  @Column()
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

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

  // Relationship with Run-Report
  @OneToOne(() => RunReport, (runReport) => runReport.patientCareReport, {
    nullable: false,
  })
  runReport: RunReport;

  // Relationship with MedicalCondition
  @OneToMany(
    () => MedicalCondition,
    (medicalCondition) => medicalCondition.PCR,
    { cascade: true },
  )
  medicalConditions: MedicalCondition[];

  // Relationship with Allergy
  @OneToMany(() => Allergy, (allergy) => allergy.PCR, { cascade: true })
  allergies: Allergy[];
}
