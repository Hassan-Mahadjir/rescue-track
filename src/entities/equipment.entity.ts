import { EquipmentStatus } from 'src/enums/equipmentStatus.enums';
import { EquipmentType } from 'src/enums/equipmentType.enums';
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
import { MaintenanceRecord } from './maintenance-record.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: EquipmentType, default: EquipmentType.OTHER })
  category: EquipmentType;

  @Column()
  serialNumber: string;

  @Column()
  modelNumber: string;

  @Column()
  manufacturer: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column()
  warrantyPeriod: number;

  @Column({ nullable: true })
  stockQuantity: number;

  @Column({ nullable: true })
  nextMaintenanceDate: Date;

  @Column({
    type: 'enum',
    enum: EquipmentStatus,
    default: EquipmentStatus.ACTIVE,
  })
  status: EquipmentStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdById: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.equipments, {
    nullable: true,
  })
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(
    () => MaintenanceRecord,
    (maintenanceRecord) => maintenanceRecord.equipment,
    { cascade: true, nullable: true },
  )
  maintenanceRecords: MaintenanceRecord[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.equipment, {
    cascade: true,
  })
  orderItems: OrderItem[];
}
