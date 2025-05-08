import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateAdminProfileDto } from '../profile/dto/create-admin-profile.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateAdminProfileDto } from 'src/profile/dto/update-admin-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ProfileService } from 'src/profile/profile.service';
import { ParseIdPipe } from 'src/user/pipes/parseIdpipe';

@Controller('administrator')
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
    private profileService: ProfileService,
  ) {}

  @Public()
  @Post('create-admin')
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const { email, password, ...profileField } = createUserDto;
    const profileData: CreateAdminProfileDto =
      profileField as CreateAdminProfileDto;

    return await this.administratorService.createAdmin(
      createUserDto,
      profileData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const prifle = this.profileService.findOne(req.user.id, true);
    return prifle;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateAdminProfileDto) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.profileService.update(userId, updateProfileDto, true);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {}
}
