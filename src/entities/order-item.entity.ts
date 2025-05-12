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

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Medication, (medication) => medication.orderItems, {
    nullable: true,
  })
  @JoinColumn()
  medication: Medication;

  @ManyToOne(() => Equipment, (equipment) => equipment.orderItems, {
    nullable: true,
  })
  @JoinColumn()
  equipment: Equipment;
}
