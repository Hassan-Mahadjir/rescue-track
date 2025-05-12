import { Status } from 'src/enums/status.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';
import { Medication } from './medication.entity';
import { SupplierSpecialist } from 'src/enums/supplier-Specialist.enums';
import { UpdateHistory } from './updateHistory.entity';
import { Order } from './order.entity';
@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: SupplierSpecialist,
    default: SupplierSpecialist.OTHER,
  })
  Specialist: SupplierSpecialist;

  @Column({ nullable: true })
  website: string;

  @Column()
  contactPerson: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column()
  createdById: number;

  @OneToMany(() => Equipment, (equipment) => equipment.supplier, {
    onDelete: 'CASCADE',
  })
  equipments: Equipment[];

  @OneToMany(() => Medication, (medication) => medication.supplier, {
    onDelete: 'CASCADE',
  })
  medications: Medication[];

  @OneToMany(() => UpdateHistory, (updateHistory) => updateHistory.supplier, {
    onDelete: 'CASCADE',
  })
  updateHistory: UpdateHistory[];

  @OneToMany(() => Order, (order) => order.supplier, {
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
