import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { OrderItem } from './order-item.entity';
import { Unit } from './unit.entity';
import { Treatment } from './treatment.entity'; // Import Treatment entity

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TreatmentCategory,
    default: TreatmentCategory.OTHER,
  })
  category: TreatmentCategory;

  @Column()
  batchNumber: string;

  @Column()
  stockQuantity: number;

  @Column()
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdById: number;

  @Column()
  reorderPoint: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.medications)
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.medication)
  orderItems: OrderItem[];

  @ManyToOne(() => Unit, (unit) => unit.medications, {
    nullable: true,
  })
  @JoinColumn()
  unit: Unit; // Use a ManyToOne relationship for unit

  @OneToMany(() => Treatment, (treatment) => treatment.medication, {
    nullable: true,
  })
  treatments: Treatment[]; // Track treatments associated with this medication
}
