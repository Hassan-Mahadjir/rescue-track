import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from './unit.entity';
import { Medication } from './medication.entity';

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Unit, (unit) => unit.treatments, { eager: true })
  @JoinColumn()
  unit: Unit; // Use a ManyToOne relationship for unit

  // @ManyToOne(() => Medication, (medication) => medication.treatments, {
  //   nullable: false,
  // })
  // @JoinColumn()
  // medication: Medication; // Associate Treatment with a Medication

  @Column({ type: 'enum', enum: TreatmentCategory })
  category: TreatmentCategory;

  // Relationship with PCR
  @ManyToMany(() => PatientCareReport, (PCR) => PCR.treatments)
  PCR: PatientCareReport[];
}
