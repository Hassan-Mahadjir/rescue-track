import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Gender } from 'src/profile/enums/gender.enums';
import { Nationality } from 'src/profile/enums/nationality.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private UserRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ) {
    return await this.UserRepo.update(
      { id: userId },
      { hashedRefreshToken: hashedRefreshToken },
    );
  }

  async create(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    try {
      const user = await this.UserRepo.create(createUserDto);
      await this.UserRepo.save(user);

      if (createUserDto) {
        const userProfile = await this.createProfile(user.id, createProfileDto);
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating user (User already exists)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    try {
      // Save profile object
      const profile = await this.profileRepository.save(newProfile);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Profile created successfully',
        profile,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      select: ['id', 'email', 'password', 'role'],
    });

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.UserRepo.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updateHashedPassword(userId: number, newHashedPassword: string) {
    return await this.UserRepo.update(
      { id: userId },
      { password: newHashedPassword },
    );
  }
}
