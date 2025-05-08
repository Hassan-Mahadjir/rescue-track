import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ParseIdPipe } from 'src/user/pipes/parseIdpipe';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':id')
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.profileService.create(id, createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id, false);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto, false);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id, false);
  }
}
