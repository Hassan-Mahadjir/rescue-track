import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PatientCareReport } from './patient-care-report.entity';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from 'src/enums/unit.enums';

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: Unit, default: Unit.MG })
  unit: string;

  @Column({ type: 'enum', enum: TreatmentCategory })
  category: TreatmentCategory;

  // Relationship with PCR
  @ManyToMany(() => PatientCareReport, (PCR) => PCR.treatments)
  @JoinTable()
  PCR: PatientCareReport[];
}
