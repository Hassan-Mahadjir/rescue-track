import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Medication } from './medication.entity';
import { Equipment } from './equipment.entity';
import { Unit } from './unit.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Medication, (medication) => medication.orderItems, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  medication: Medication;

  @ManyToOne(() => Equipment, (equipment) => equipment.orderItems, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  equipment: Equipment;

  @ManyToOne(() => Unit, (unit) => unit.orderItems, {
    nullable: true,
  })
  @JoinColumn()
  unit: Unit; // Use a ManyToOne relationship for unit
}
