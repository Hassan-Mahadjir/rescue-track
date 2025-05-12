import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { OrderItem } from './order-item.entity';
import { Unit } from 'src/enums/unit.enums';

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

  @Column({ type: 'enum', enum: Unit, default: Unit.MG })
  unit: Unit;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.medication)
  orderItems: OrderItem[];
}
