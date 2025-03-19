import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Gender } from './enums/gender.enums';
import { Nationality } from './enums/nationality.enums';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  async create(userId: number, createProfileDto: CreateProfileDto) {
    // Get user object
    const user = await this.userService.findOne(userId);
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

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: number) {
    const userProfile = await this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'user')
      .where('profile.user.id = :id', { id })
      .getOne();

    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile fetched successfully.',
      userProfile,
    };
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const updateResult = await this.profileRepository.update(
      { user: { id } },
      updateProfileDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const updatedProfile = await this.profileRepository.findOne({
      where: { user: { id } },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
