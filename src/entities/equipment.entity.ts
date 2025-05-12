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

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: EquipmentType, default: EquipmentType.OTHER })
  type: EquipmentType;

  @Column()
  serialNumber: string;

  @Column()
  modelNumber: string;

  @Column()
  manufacturer: string;

  @Column()
  purchaseDate: Date;

  @Column()
  warrantyPeriod: number;

  @Column()
  nextMaintenanceDate: Date;

  @Column({
    type: 'enum',
    enum: EquipmentStatus,
    default: EquipmentStatus.ACTIVE,
  })
  status: EquipmentStatus;

  @Column()
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
  )
  maintenanceRecords: MaintenanceRecord[];
}
