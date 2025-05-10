import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { ProfileService } from 'src/profile/profile.service';
import { ParseIdPipe } from 'src/user/pipes/parseIdpipe';

import { RolesJwtAuthGuard } from 'src/auth/guards/role-jwt/role-jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { DatabaseConnectionService } from 'src/database/database.service';

@Controller('administrator')
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
    private profileService: ProfileService,
    private databaseConnectionService: DatabaseConnectionService,
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

  @UseGuards(RolesJwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const prifle = this.profileService.findOne(req.user.id, true);
    return prifle;
  }

  @UseGuards(RolesJwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateAdminProfileDto) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.profileService.update(userId, updateProfileDto, true);
  }

  @UseGuards(RolesJwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {}

  @UseGuards(RolesJwtAuthGuard)
  @Roles(Role.DEVELOPER)
  @Patch('approve-organization/:id')
  approveOrganization(@Param('id', ParseIdPipe) id) {
    return this.administratorService.approveOrganization(+id);
  }

  @UseGuards(RolesJwtAuthGuard)
  @Roles(Role.DEVELOPER)
  @Post('grant-database-access/:id')
  grantDatabaseAccess(
    @Param('id', ParseIdPipe) id,
    @Body() createDatabaseDto: CreateDatabaseDto,
  ) {
    return this.administratorService.grantDatabaseAccess(
      +id,
      createDatabaseDto,
    );
  }

  @Post('reinitialize-databases')
  @UseGuards(RolesJwtAuthGuard)
  @Roles(Role.DEVELOPER)
  async reinitializeDatabases() {
    // await this.databaseConnectionService.reinitializeAllConnections();
    // return {
    //   status: HttpStatus.OK,
    //   message: 'All database connections reinitialized successfully',
    // };
  }
}
