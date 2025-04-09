import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto, @Req() req) {
    const userId = req.user.id;
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    return this.patientService.create(userId, createPatientDto);
  }
  // This endpoint is used to get all patients for the admin
  @Get('/manage')
  @Roles(Role.ADMIN)
  findAll() {
    return this.patientService.findAll();
  }

  @Get('manage/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  // This endpoint is used to get a patient for the logged-in user
  @Get(':id')
  getPatient(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.patientService.getPatient(+id, userId);
  }

  // This endpoint is used to get all patients for the logged-in user
  @Get()
  getPatients(@Req() req) {
    const userId = req.user.id;
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.patientService.getPatients(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    return this.patientService.update(+id, updatePatientDto, userId);
  }

  @Delete('manage/:id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }
}
