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
import { PatientCareReportService } from './patient-care-report.service';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';

@Controller('patient-care-report')
export class PatientCareReportController {
  constructor(
    private readonly patientCareReportService: PatientCareReportService,
  ) {}

  @Post()
  create(
    @Body() createPatientCareReportDto: CreatePatientCareReportDto,
    @Req() req,
  ) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.patientCareReportService.create(
      userId,
      createPatientCareReportDto,
    );
  }

  @Get()
  findAll() {
    return this.patientCareReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientCareReportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientCareReportDto: UpdatePatientCareReportDto,
  ) {
    return this.patientCareReportService.update(
      +id,
      updatePatientCareReportDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientCareReportService.remove(+id);
  }
}
