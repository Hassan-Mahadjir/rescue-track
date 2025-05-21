import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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
import { Truma } from './truma.entity';
import { InjuryMechanism } from './injury-mechanism.entity';
import { VitalSign } from './vital-sign.entity';
import { Pupil } from './pupil.entity';
import { Skin } from './skin.entity';
import { RESP } from './RESP.entity';

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

  // Relationship with Run-Report
  @OneToOne(() => RunReport, (runReport) => runReport.patientCareReport, {
    nullable: false,
  })
  runReport: RunReport | null;

  // Relationship with MedicalCondition
  @ManyToMany(
    () => MedicalCondition,
    (medicalCondition) => medicalCondition.PCR,
  )
  @JoinTable({ name: 'PCR-MedicalCondition' })
  medicalConditions: MedicalCondition[];

  // Relationship with Allergy
  @ManyToMany(() => Allergy, (allergy) => allergy.PCR)
  @JoinTable({ name: 'PCR-Allergy' })
  allergies: Allergy[];

  // Relationship with Truma
  @OneToMany(() => Truma, (truma) => truma.PCR, { cascade: true })
  @JoinColumn({ name: 'PCR-Truma' })
  truma: Truma[];

  // Relationship with InjuryMechanism
  @OneToMany(() => InjuryMechanism, (injuryMechanism) => injuryMechanism.PCR, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  injuryMechanism: InjuryMechanism[];

  // Relationship with VitalSign
  @OneToMany(() => VitalSign, (vitalSign) => vitalSign.PCR, { nullable: true })
  @JoinColumn()
  vitalSign: VitalSign[];

  // Relationship with physical(pupil, skin, RESP)
  @OneToMany(() => Pupil, (pupil) => pupil.PCR, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  pupil: Pupil[];
  @OneToMany(() => Skin, (skin) => skin.PCR, { nullable: true, cascade: true })
  @JoinColumn()
  skin: Skin[];
  @OneToMany(() => RESP, (resp) => resp.PCR, { nullable: true, cascade: true })
  @JoinColumn()
  resp: RESP[];
}
