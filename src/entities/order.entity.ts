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
import { OrderStatus } from 'src/enums/orderStatus.enums';
import { OrderItem } from './order-item.entity';
import { UpdateHistory } from './updateHistory.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column()
  notes: string;

  @Column()
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.orders)
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => UpdateHistory, (updateHistory) => updateHistory.order)
  updateHistory: UpdateHistory[];
}
