import { Nationality } from 'src/enums/nationality.enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Owner } from './owner.entity';
import { Gender } from 'src/enums/gender.enums';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, type: 'text' })
  address: string | null;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true, type: 'enum', enum: Nationality })
  nationality: Nationality;

  @Column({ nullable: true })
  dateofBirth: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationship with User (Employee Profile)
  @OneToOne(() => Owner, (owner) => owner.profile)
  @JoinColumn()
  owner: Owner;

  // Relationship with User (Employee Profile)
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'EMPLOYEE_PROFILE' })
  user: User;
}
