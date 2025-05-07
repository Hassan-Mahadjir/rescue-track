import { Body, Controller, Post } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateAdminProfileDto } from '../profile/dto/create-admin-profile.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('administrator')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

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
}
