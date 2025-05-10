import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities/main/profile.entity';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { Hospital } from 'src/entities/main/hospital.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'primary')
    private UserRepo: Repository<User>,
    @InjectRepository(Profile, 'primary')
    private profileRepository: Repository<Profile>,
    @InjectRepository(Hospital, 'primary')
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async updateHashedRefreshToken(userId: number, refreshToken: string | null) {
    return await this.UserRepo.update(
      { id: userId },
      { hashedRefreshToken: refreshToken },
    );
  }

  async create(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    const existingUser = await this.UserRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hospital = await this.hospitalRepository.findOne({
      where: { id: createProfileDto.hospitalID },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const user = await this.UserRepo.create({
      ...createUserDto,
      email: createUserDto.email.toLocaleLowerCase(),
      hospital: hospital,
    });
    await this.UserRepo.save(user);

    if (createProfileDto) {
      await this.createProfile(user.id, createProfileDto);
    }
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  async createProfile(userId: number, createProfileDto: CreateProfileDto) {
    // Get user object
    const user = await this.findOne(userId);
    // Create profile object
    const newProfile = this.profileRepository.create({
      ...createProfileDto,
      gender: createProfileDto.gender as Gender,
      nationality: createProfileDto.nationality as Nationality,
      user,
    });
    // Save profile object
    const profile = await this.profileRepository.save(newProfile);
    return {
      status: HttpStatus.CREATED,
      message: 'Profile created successfully',
      data: profile,
    };
  }

  async findByEmail(email: string) {
    return await this.UserRepo.findOne({ where: { email } });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.UserRepo.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role', 'hashedRefreshToken'],
      relations: ['hospital'],
    });

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepo.update({ id }, updateUserDto);
  }

  async remove(userId: number) {
    const userProfile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    }

    await this.profileRepository.remove(userProfile);

    return await this.UserRepo.delete({ id: userId });
  }

  async updateHashedPassword(userId: number, newHashedPassword: string) {
    return await this.UserRepo.update(
      { id: userId },
      { password: newHashedPassword },
    );
  }

  async getStaff() {
    const staff = await this.UserRepo.find({ relations: ['profile'] });

    if (!staff) throw new NotFoundException('No staff found');
    return {
      status: HttpStatus.OK,
      message: `${staff.length} - Staff fetched successfully`,
      data: staff,
    };
  }
}
