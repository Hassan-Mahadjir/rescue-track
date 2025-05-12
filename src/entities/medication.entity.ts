import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column({
    type: 'enum',
    enum: TreatmentCategory,
    default: TreatmentCategory.OTHER,
  })
  category: TreatmentCategory;

  @Column()
  batchNumber: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column()
  expirationDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  createdById: number;

  @Column()
  reorderPoint: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.medications)
  @JoinColumn()
  supplier: Supplier;
}
