import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Owner } from './owner.entity';
import * as argon2 from 'argon2';
import { User } from './user.entity';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  databaseUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relationship with Owner
  @OneToOne(() => Owner, (owner) => owner.hospital)
  @JoinColumn()
  owner: Owner;

  // Relationship with User
  @OneToMany(() => User, (user) => user.hospital)
  @JoinColumn()
  users: User[];
}
