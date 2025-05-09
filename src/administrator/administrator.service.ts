import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from 'src/entities/main/owner.entity';
import { Profile as OwnerProfile } from 'src/entities/main/profile.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { HttpStatus } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { Hospital } from 'src/entities/main/hospital.entity';
import { CreateDatabaseDto } from './dto/create-database.dto';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Owner, 'primary')
    private ownerRepository: Repository<Owner>,
    @InjectRepository(OwnerProfile, 'primary')
    private ownerProfileRepository: Repository<OwnerProfile>,
    private mailService: MailService,
    @InjectRepository(Hospital, 'primary')
    private databaseRepository: Repository<Hospital>,
  ) {}

  async createAdmin(
    createUserDto: CreateUserDto,
    createProfileDto: CreateProfileDto,
  ) {
    const existingUser = await this.ownerRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.ownerRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    });
    await this.ownerRepository.save(user);

    if (createProfileDto) {
      await this.createProfile(user.id, createProfileDto);
    }

    await this.mailService.sendWaitListEmail(createUserDto.email);

    return {
      status: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: user,
    };
  }

  async createProfile(userId: number, createProfileDto: CreateProfileDto) {
    const user = await this.ownerRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID: ${userId} not found`);
    }

    const newProfile = this.ownerProfileRepository.create({
      ...createProfileDto,
      gender: createProfileDto.gender as Gender,
      nationality: createProfileDto.nationality as Nationality,
      owner: user,
    });

    const profile = await this.ownerProfileRepository.save(newProfile);
    return {
      status: HttpStatus.CREATED,
      message: 'Profile created successfully',
      data: profile,
    };
  }

  async findByEmail(email: string) {
    return await this.ownerRepository.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.ownerRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role', 'hashedRefreshToken'],
    });

    if (!user) throw new NotFoundException(`User with ID: ${id} not found`);

    return user;
  }

  async updateHashedRefreshToken(userId: number, refreshToken: string | null) {
    return await this.ownerRepository.update(
      { id: userId },
      { hashedRefreshToken: refreshToken },
    );
  }

  async updateHashedPassword(userId: number, newHashedPassword: string) {
    return await this.ownerRepository.update(
      { id: userId },
      { password: newHashedPassword },
    );
  }

  async approveOrganization(id: number) {
    const organization = await this.ownerRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Owner with ID: ${id} not found`);
    }

    if (organization.isApproved) {
      throw new ConflictException('Organization already approved');
    }

    await this.mailService.sendApprovalEmail(organization.email);

    await this.ownerRepository.update({ id }, { isApproved: true });

    const approved_organization = await this.ownerRepository.findOne({
      where: { id },
    });

    return {
      status: HttpStatus.OK,
      message: 'Organization approved successfully',
      data: approved_organization,
    };
  }

  async grantDatabaseAccess(id: number, createDatabaseDto: CreateDatabaseDto) {
    const organization = await this.ownerRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Owner with ID: ${id} not found`);
    }

    if (!organization.isApproved) {
      throw new UnauthorizedException('Organization not approved yet');
    }

    const existingDatabase = await this.databaseRepository.findOne({
      where: { name: createDatabaseDto.name },
    });
    if (existingDatabase) {
      throw new ConflictException('Database name already exists');
    }

    const database = this.databaseRepository.create({
      ...createDatabaseDto,
      owner: organization,
    });

    await this.databaseRepository.save(database);

    return {
      status: HttpStatus.CREATED,
      message: 'Database access granted successfully',
      data: database,
    };
  }

  async findDatabaseByName(name: string) {
    const databaseInfo = await this.databaseRepository.findOne({
      where: { name: name },
    });
    if (!databaseInfo)
      throw new NotFoundException(`Database with name: ${name} not found`);
    return {
      status: HttpStatus.OK,
      message: 'Database found successfully',
      data: databaseInfo,
    };
  }
}
