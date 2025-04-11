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
  UseGuards,
} from '@nestjs/common';
import { PatientCareReportService } from './patient-care-report.service';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

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

  @Get('/manage')
  @Roles(Role.ADMIN)
  findAll() {
    return this.patientCareReportService.findAll();
  }

  @Get('/manage/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.patientCareReportService.findOne(+id);
  }

  @Get(':id')
  getReportLast24Hours(@Param('id') id: string, @Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.patientCareReportService.getReportFromLast24Hours(+id, userId);
  }

  @Get()
  getReportsLast24Hours(@Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.patientCareReportService.getReportsFromLast24Hours(userId);
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

  @Delete('manage/:id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.patientCareReportService.remove(+id);
  }
}
