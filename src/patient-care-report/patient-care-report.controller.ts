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
import { Treatment, TreatmentDto } from './dto/create-treatement.dto';
import { UpdateTreatmentDto } from './dto/update-treatement.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { CreateMedicalConditionDto } from './dto/create-medical-condition.dto';
import { UpdateMedicalConditionDto } from './dto/update-medical-condition.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { TrumaDto } from './dto/create-truma.dto';
import { UpdateTrumaDto } from './dto/update-truma.dto';
import { CreateInjuryMechanismDto } from './dto/create-InjuryMechanim.dto';
import { UpdateInjuryMechanism } from './dto/update-InjuryMechanism.dto';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { UpdateVitalSignDto } from './dto/update-vital-sing.dto';

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
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.patientCareReportService.findAll();
  }

  @Get('/manage/stats')
  getReportStats() {
    return this.patientCareReportService.getReportStats();
  }

  @Get('/manage/:id')
  @Roles(UserRole.ADMIN)
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
    @Req() req,
  ) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.patientCareReportService.update(
      +id,
      updatePatientCareReportDto,
      userId,
    );
  }

  @Delete('manage/:id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.patientCareReportService.remove(+id);
  }

  @Post('/treatment/:id')
  addTreatmentToReport(
    @Param('id') vitalSigntId: string,
    @Body() createTreatmentDto: Treatment,
  ) {
    return this.patientCareReportService.addTreatmentToVitalSign(
      +vitalSigntId,
      createTreatmentDto,
    );
  }
  @Post('/treatments')
  createTreatments(@Body() createTreatmentDto: TreatmentDto) {
    return this.patientCareReportService.createTreatments(createTreatmentDto);
  }

  @Post('/medical-conditions')
  createMedicalConditions(
    @Body() createMedicalConditionDto: CreateMedicalConditionDto[],
  ) {
    return this.patientCareReportService.createMedicalConditions(
      createMedicalConditionDto,
    );
  }

  @Post('/allergies')
  createAllergies(@Body() createAllergyDto: CreateAllergyDto[]) {
    return this.patientCareReportService.createAllergies(createAllergyDto);
  }

  @Patch('/treatment/:vitalSignId/:treatmentId')
  updateTreatmentforVitalSing(
    @Param('vitalSignId') vitalSignId: string,
    @Param('treatmentId') treatmentId: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ) {
    return this.patientCareReportService.updateTreatmentForVitalSing(
      +vitalSignId,
      +treatmentId,
      updateTreatmentDto,
    );
  }

  @Delete('/treatment/:id')
  @Roles(UserRole.ADMIN)
  removeTreatmentFromReport(@Param('id') treatmentId: string) {
    return this.patientCareReportService.removeTreatmentFromReport(
      +treatmentId,
    );
  }

  @Post('/allergy/:id')
  addAllergyToReport(
    @Param('id') reportId: string,
    @Body() createAllergyDto: CreateAllergyDto,
  ) {
    return this.patientCareReportService.addAllergyToReport(
      +reportId,
      createAllergyDto,
    );
  }

  @Patch('/allergy/:id')
  updateAllergyFromReport(
    @Param('id') allergyId: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
  ) {
    return this.patientCareReportService.updateAllergyFromReport(
      +allergyId,
      updateAllergyDto,
    );
  }

  @Delete('/allergy/:id')
  removeAllergyFromReport(@Param('id') allergyId: string) {
    return this.patientCareReportService.removeAllergyFromReport(+allergyId);
  }

  @Post('/medical-condition/:id')
  addMedicalConditionToReport(
    @Param('id') reportId: string,
    @Body() createMedicalConditionDto: CreateMedicalConditionDto,
  ) {
    return this.patientCareReportService.addMedicalConditionToReport(
      +reportId,
      createMedicalConditionDto,
    );
  }

  @Patch('/medical-condition/:id')
  updateMedicalConditionFromReport(
    @Param('id') medicalConditionId: string,
    @Body() updateMedicalConditionDto: UpdateMedicalConditionDto,
  ) {
    return this.patientCareReportService.updateMedicalConditionFromReport(
      +medicalConditionId,
      updateMedicalConditionDto,
    );
  }

  @Delete('/medical-condition/:id')
  removeMedicalConditionFromReport(@Param('id') medicalConditionId: string) {
    return this.patientCareReportService.removeMedicalConditionFromReport(
      +medicalConditionId,
    );
  }

  @Post('/truma/:id')
  addTrumaToReport(
    @Param('id') reportId: string,
    @Body() createTrumaDto: TrumaDto,
  ) {
    return this.patientCareReportService.addTrumaToReport(
      +reportId,
      createTrumaDto,
    );
  }

  @Patch('/truma/:id')
  updateTrumaFromReport(
    @Param('id') trumaId: string,
    @Body() updateTrumaDto: UpdateTrumaDto,
  ) {
    return this.patientCareReportService.updateTrumaFromReport(
      +trumaId,
      updateTrumaDto,
    );
  }

  @Delete('/truma/:id')
  removeTrumaFromReport(@Param('id') trumaId: string) {
    return this.patientCareReportService.removeTrumaFromReport(+trumaId);
  }

  @Post('/injury-mechanism/:id')
  addInjuryMechanismToReport(
    @Param('id') reportId: string,
    @Body() createInjuryMechanismDto: CreateInjuryMechanismDto,
  ) {
    return this.patientCareReportService.addinjuryMechanismToReport(
      +reportId,
      createInjuryMechanismDto,
    );
  }

  @Patch('/injury-mechanism/:id')
  updateInjuryMechanismFromReport(
    @Param('id') injuryMechanismId: string,
    @Body() updateInjuryMechanismDto: UpdateInjuryMechanism,
  ) {
    return this.patientCareReportService.updateInjuryMechanismFromReport(
      +injuryMechanismId,
      updateInjuryMechanismDto,
    );
  }

  @Delete('/injury-mechanism/:id')
  removeInjuryMechanismFromReport(@Param('id') injuryMechanismId: string) {
    return this.patientCareReportService.removeInjuryMechanismFromReport(
      +injuryMechanismId,
    );
  }

  @Post('/vital-signs/:id')
  addVitalSignsToReport(
    @Param('id') reportId: string,
    @Body() vitalSigns: CreateVitalSignDto,
  ) {
    return this.patientCareReportService.addVitalSignsToReport(
      +reportId,
      vitalSigns,
    );
  }

  @Patch('/vital-signs/:id')
  updateVitalSignsFromReport(
    @Param('id') vitalSignsId: string,
    @Body() updateVitalSigns: UpdateVitalSignDto,
  ) {
    return this.patientCareReportService.updateVitalSignsFromReport(
      +vitalSignsId,
      updateVitalSigns,
    );
  }

  @Delete('/vital-signs/:id')
  removeVitalSignsFromReport(@Param('id') vitalSignsId: string) {
    return this.patientCareReportService.removeVitalSignsFromReport(
      +vitalSignsId,
    );
  }
}
