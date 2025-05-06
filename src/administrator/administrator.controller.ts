import { Body, Controller, Post } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';

@Controller('administrator')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post('create-admin')
  async createAdmin(
    @Body() createUserDto: CreateUserDto,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.administratorService.createAdmin(
      createUserDto,
      createProfileDto,
    );
  }
}
