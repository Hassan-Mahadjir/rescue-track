import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { Unit } from './unit.entity';
import { VitalSign } from './vital-sign.entity';

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  dosage: number;

  @Column({ type: 'timestamp', nullable: true })
  givenAt: Date;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  result: string;

  @ManyToOne(() => Unit, (unit) => unit.treatments, { eager: true })
  @JoinColumn()
  unit: Unit;

  @Column({ type: 'enum', enum: TreatmentCategory })
  category: TreatmentCategory;

  // Relationship with vitalSign
  @ManyToOne(() => VitalSign, (vitalSign) => vitalSign.treatments, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  vitalSign: VitalSign;
}
