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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseIdPipe } from './pipes/parseIdpipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
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

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.userService.remove(id);
  }
}
