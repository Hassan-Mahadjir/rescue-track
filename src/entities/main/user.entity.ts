import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as argon2 from 'argon2';
import { UserRole } from 'src/enums/user-role.enum';
import { Profile } from './profile.entity';
import { Hospital } from './hospital.entity';
import { Owner } from './owner.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'text' })
  hashedRefreshToken: string | null;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpCodeExpiry: Date;

  @Column({ default: false })
  isVerified: boolean;

  // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // Relationship with OWNER
  @OneToOne(() => Owner, (owner) => owner.profile)
  owner: Owner;

  // Relationship with HOSPITAL
  @ManyToOne(() => Hospital, (hospital) => hospital.users)
  hospital: Hospital;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
