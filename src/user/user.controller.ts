import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseIdPipe } from './pipes/parseIdpipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { ProfileService } from 'src/profile/profile.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private profileService: ProfileService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const { email, password, ...profileField } = createUserDto;
    const profileData: CreateProfileDto = profileField as CreateProfileDto;

    return this.userService.create(createUserDto, profileData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const prifle = this.profileService.findOne(req.user.id);
    return prifle;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.profileService.update(userId, updateProfileDto);
  }

  @Get('/staff')
  getStaff() {
    return this.userService.getStaff();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIdPipe) id, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Patch('manage-profile/:id')
  async updateProfileAdmin(
    @Body() updateProfileDto: UpdateUserDto,
    @Param('id', ParseIdPipe) id,
  ) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const { email, password, role, ...profileField } = updateProfileDto;
    if (email || password || role) {
      await this.userService.update(id, { email, password, role });
    }
    if (Object.keys(profileField).length > 0) {
      const profileData: CreateProfileDto = profileField as CreateProfileDto;
      await this.profileService.update(id, profileData);
    }

    return { message: 'Profile updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.userService.remove(id);
  }
}
