import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums/role.enums';
import { Profile } from './profile.entity';
import { Hospital } from './hospital.entity';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.OWNER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'text' })
  hashedRefreshToken: string | null;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpCodeExpiry: Date;

  @Column({ default: false })
  isApproved: boolean;

  // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // Relationship with Hospital
  @OneToOne(() => Hospital, (hospital) => hospital.owner, { nullable: true })
  hospital: Hospital;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
