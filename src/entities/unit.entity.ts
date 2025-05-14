import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Treatment } from './treatment.entity';
import { Unit as UnitEnum } from 'src/enums/unit.enums';
import { OrderItem } from './order-item.entity';
import { Medication } from './medication.entity';

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UnitEnum, default: UnitEnum.MG })
  abbreviation: UnitEnum;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Treatment, (treatment) => treatment.unit)
  treatments: Treatment[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.unit)
  orderItems: OrderItem[]; // Use a OneToMany relationship for order items

  @OneToMany(() => Medication, (medication) => medication.unit)
  medications: Medication[]; // Use a OneToMany relationship for medications
}
