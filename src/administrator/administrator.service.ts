import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as AdminUser } from 'src/entities/main/user.entity';
import { Profile as AdminProfile } from 'src/entities/main/profile.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Role } from 'src/auth/enums/role.enums';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(AdminUser, 'primary')
    private primaryUserRepository: Repository<AdminUser>,
    @InjectRepository(AdminProfile, 'primary')
    private primaryProfileRepository: Repository<AdminProfile>,
  ) {}

  async createAdmin(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    const existingUser = await this.primaryUserRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.primaryUserRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    });
    await this.primaryUserRepository.save(user);

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
    const user = await this.primaryUserRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID: ${userId} not found`);
    }

    const newProfile = this.primaryProfileRepository.create({
      ...createProfileDto,
      gender: createProfileDto.gender as Gender,
      nationality: createProfileDto.nationality as Nationality,
      user,
    });

    const profile = await this.primaryProfileRepository.save(newProfile);
    return {
      status: HttpStatus.CREATED,
      message: 'Profile created successfully',
      data: profile,
    };
  }

  async findByEmail(email: string) {
    return await this.primaryUserRepository.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.primaryUserRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role', 'hashedRefreshToken'],
    });

    if (!user) throw new NotFoundException(`User with ID: ${id} not found`);

    return user;
  }

  async updateHashedRefreshToken(userId: number, refreshToken: string | null) {
    return await this.primaryUserRepository.update(
      { id: userId },
      { hashedRefreshToken: refreshToken },
    );
  }

  async updateHashedPassword(userId: number, newHashedPassword: string) {
    return await this.primaryUserRepository.update(
      { id: userId },
      { password: newHashedPassword },
    );
  }
}
