import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Role } from 'src/auth/enums/role.enums';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createAdmin(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      role: Role.ADMIN, // Set role as ADMIN
    });
    await this.userRepository.save(user);

    if (createProfileDto) {
      await this.createProfile(user.id, createProfileDto);
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: user,
    };
  }

  async createProfile(userId: number, createProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newProfile = this.profileRepository.create({
      ...createProfileDto,
      gender: createProfileDto.gender as Gender,
      nationality: createProfileDto.nationality as Nationality,
      user,
    });

    const profile = await this.profileRepository.save(newProfile);
    return {
      status: HttpStatus.CREATED,
      message: 'Profile created successfully',
      data: profile,
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role', 'hashedRefreshToken'],
    });
  }
}
