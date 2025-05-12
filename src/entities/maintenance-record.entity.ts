import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity()
export class MaintenanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maintenanceDate: Date;

  @Column({ nullable: true })
  maintenanceType: string;

  @Column({ nullable: true })
  maintenanceCost: number;

  @Column({ nullable: true })
  maintenanceStatus: string;

  @Column()
  requestedBy: number;

  @Column({ nullable: true })
  approvedBy: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.maintenanceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  equipment: Equipment;
}
