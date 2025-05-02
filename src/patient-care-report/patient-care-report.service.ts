import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Repository } from 'typeorm';
import { Treatment } from 'src/entities/treatment.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from 'src/entities/patient.entity';
import { LessThan, MoreThan } from 'typeorm';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { RunReport } from 'src/entities/run-report.entity';
import { UpdateTreatmentDto } from './dto/update-treatement.dto';
import { Treatment as TreatmentDto } from './dto/create-treatement.dto';
import { MedicalCondition } from 'src/entities/medical-condition.entity';
import { Allergy } from 'src/entities/allergy.entity';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { CreateMedicalConditionDto } from './dto/create-medical-condition.dto';
import { UpdateMedicalConditionDto } from './dto/update-medical-condition.dto';

@Injectable()
export class PatientCareReportService {
  constructor(
    @InjectRepository(PatientCareReport)
    private PCRRepository: Repository<PatientCareReport>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    private userService: UserService,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(UpdateHistory)
    private updateHistoryRepository: Repository<UpdateHistory>,
    @InjectRepository(RunReport)
    private runReportRepository: Repository<RunReport>,
    @InjectRepository(MedicalCondition)
    private medicalConditionRepository: Repository<MedicalCondition>,
    @InjectRepository(Allergy)
    private allergyRepository: Repository<Allergy>,
  ) {}
  async create(
    initiatedPersonId: number,
    createPatientCareReportDto: CreatePatientCareReportDto,
  ) {
    const initiatedPerson = await this.userService.findOne(initiatedPersonId);

    const runReport = await this.runReportRepository.findOne({
      where: { id: createPatientCareReportDto.runReportId },
      relations: ['patient', 'patientCareReport'],
    });

    if (!runReport) {
      throw new NotFoundException(
        `No report found with ID ${createPatientCareReportDto.runReportId}`,
      );
    }

    // ✅ Check if this runReport already has a PCR
    if (runReport.patientCareReport) {
      throw new BadRequestException(
        `This run report already has an associated patient care report.`,
      );
    }

    const patient = await this.patientRepository.findOne({
      where: { id: runReport.patient.id },
    });

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createPatientCareReportDto.patientId} not found`,
      );
    }

    if (runReport.patient.id !== patient.id) {
      throw new BadRequestException(
        `The run report is not associated with patient ID ${patient.id}`,
      );
    }

    const newPCR = this.PCRRepository.create({
      ...createPatientCareReportDto,
      patient,
      treatments: createPatientCareReportDto.treatments.map((t) =>
        this.treatmentRepository.create(t),
      ),
      medicalConditions: createPatientCareReportDto.medicalConditions.map((m) =>
        this.medicalConditionRepository.create(m),
      ),
      allergies: createPatientCareReportDto.allergies.map((a) =>
        this.allergyRepository.create(a),
      ),
      initiatedBy: initiatedPerson,
      runReport,
    });

    const savedPCR = await this.PCRRepository.save(newPCR);

    return {
      status: HttpStatus.CREATED,
      message: 'Patient care report created successfully',
      data: savedPCR,
    };
  }

  async findAll() {
    const reports = await this.PCRRepository.find({
      relations: [
        'treatments',
        'initiatedBy',
        'initiatedBy.profile',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });

    return {
      status: HttpStatus.FOUND,
      message: `${reports.length} Patient care reports fetched successfully`,
      data: reports,
    };
  }

  async findOne(id: number) {
    const report = await this.PCRRepository.findOne({
      where: { id: id },
      relations: [
        'treatments',
        'initiatedBy',
        'initiatedBy.profile',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });

    if (!report)
      throw new NotFoundException(`Report with ${id} was not found.`);

    return {
      status: HttpStatus.FOUND,
      message: 'Patient care report found successfully',
      data: report,
    };
  }

  async getReportFromLast24Hours(id: number, userId: number) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const PCR = await this.PCRRepository.findOne({
      where: {
        id: id,
        createdAt: MoreThan(twentyFourHoursAgo),
        initiatedBy: { id: userId },
      },
      relations: [
        'treatments',
        'initiatedBy',
        'initiatedBy.profile',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });
    if (!PCR)
      throw new NotFoundException(`No matching report found or access denied`);

    return {
      status: HttpStatus.FOUND,
      message: 'Patient care report found successfully.',
      data: PCR,
    };
  }

  async getReportsFromLast24Hours(initiatedByID: number) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const createdByUser = await this.userService.findOne(initiatedByID);

    const PCRs = await this.PCRRepository.find({
      where: {
        initiatedBy: createdByUser,
        createdAt: MoreThan(twentyFourHoursAgo),
      },
      relations: ['treatments'],
    });

    if (!PCRs)
      throw new NotFoundException(`No reports found in the last 24 hours`);

    return {
      status: HttpStatus.FOUND,
      message: `${PCRs.length} Patient care report found successfully.`,
      data: PCRs,
    };
  }

  async update(
    id: number,
    updatePatientCareReportDto: UpdatePatientCareReportDto,
  ) {
    const report = await this.PCRRepository.findOne({
      where: { id },
      relations: [
        'treatments',
        'patient',
        'initiatedBy',
        'allergies',
        'medicalConditions',
      ],
    });

    if (!report) {
      throw new NotFoundException(
        `Patient care report with id ${id} not found`,
      );
    }

    // Optional: Update treatments if provided
    if (updatePatientCareReportDto.treatments) {
      report.treatments = updatePatientCareReportDto.treatments.map((t) =>
        this.treatmentRepository.create(t),
      );
    }

    // Optional: Update patient if patientId is provided
    if (updatePatientCareReportDto.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: updatePatientCareReportDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(
          `Patient with id ${updatePatientCareReportDto.patientId} not found`,
        );
      }

      report.patient = patient;
    }
    const updatedReport = await this.PCRRepository.save(report);

    const updateBy = await this.userService.findOne(report.initiatedBy.id);

    const history = this.updateHistoryRepository.create({
      updatedBy: updateBy,
      patientCareReport: report,
      updateFields: updatePatientCareReportDto,
    });

    const savedUpdate = await this.updateHistoryRepository.save(history);

    return {
      status: HttpStatus.OK,
      message: 'Patient care report updated successfully',
      data: savedUpdate,
    };
  }

  async remove(id: number) {
    const report = await this.PCRRepository.findOne({
      where: { id },
      relations: [
        'treatments',
        'updateHistory',
        'allergies',
        'medicalConditions',
      ], // make sure to load related entities
    });

    if (!report) {
      throw new NotFoundException(`PatientCareReport with id ${id} not found`);
    }

    if (report.updateHistory?.length > 0) {
      await this.updateHistoryRepository.remove(report.updateHistory);
    }

    if (report.treatments.length > 0) {
      await this.treatmentRepository.remove(report.treatments);
    }

    if (report.allergies.length > 0) {
      await this.allergyRepository.remove(report.allergies);
    }

    if (report.medicalConditions.length > 0) {
      await this.medicalConditionRepository.remove(report.medicalConditions);
    }

    await this.PCRRepository.remove(report);

    return {
      status: HttpStatus.OK,
      message: `PatientCareReport with id ${id} has been successfully removed`,
    };
  }

  async addTreatmentToReport(
    reportId: number,
    createTreatmentDto: TreatmentDto,
  ) {
    const report = await this.PCRRepository.findOne({
      where: { id: reportId },
      relations: ['treatments'],
    });

    if (!report)
      throw new NotFoundException(`Report with id ${reportId} not found`);

    const newTreatment = this.treatmentRepository.create(createTreatmentDto);

    report.treatments.push(newTreatment);

    await this.PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Treatment added to report successfully',
      data: newTreatment,
    };
  }

  async updateTreatmentFromReport(
    treatmentId: number,
    updateTreatmentDto: UpdateTreatmentDto,
  ) {
    const treatment = await this.treatmentRepository.findOne({
      where: { id: treatmentId },
      relations: ['PCR'],
    });

    if (!treatment) {
      throw new NotFoundException(`Treatment with id ${treatmentId} not found`);
    }

    Object.assign(treatment, updateTreatmentDto);
    const updatedTreatment = await this.treatmentRepository.save(treatment);

    return {
      status: HttpStatus.OK,
      message: 'Treatment updated successfully',
      data: updatedTreatment,
    };
  }

  async removeTreatmentFromReport(treatmentId: number) {
    await this.treatmentRepository.delete(treatmentId);

    return {
      status: HttpStatus.OK,
      message: 'Treatment removed successfully',
    };
  }

  async addAllergyToReport(
    reportId: number,
    createAllergyDto: CreateAllergyDto,
  ) {
    const report = await this.PCRRepository.findOne({
      where: { id: reportId },
      relations: ['allergies'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    const newAllergy = this.allergyRepository.create(createAllergyDto);
    report.allergies.push(newAllergy);
    await this.PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Allergy added to report successfully',
      data: newAllergy,
    };
  }

  async updateAllergyFromReport(
    allergyId: number,
    updateAllergyDto: UpdateAllergyDto,
  ) {
    const allergy = await this.allergyRepository.findOne({
      where: { id: allergyId },
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with id ${allergyId} not found`);
    }

    Object.assign(allergy, updateAllergyDto);
    const updatedAllergy = await this.allergyRepository.save(allergy);

    return {
      status: HttpStatus.OK,
      message: 'Allergy updated successfully',
      data: updatedAllergy,
    };
  }

  async removeAllergyFromReport(allergyId: number) {
    await this.allergyRepository.delete(allergyId);

    return {
      status: HttpStatus.OK,
      message: 'Allergy removed successfully',
    };
  }

  async addMedicalConditionToReport(
    reportId: number,
    createMedicalConditionDto: CreateMedicalConditionDto,
  ) {
    const report = await this.PCRRepository.findOne({
      where: { id: reportId },
      relations: ['medicalConditions'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    const newMedicalCondition = this.medicalConditionRepository.create(
      createMedicalConditionDto,
    );
    report.medicalConditions.push(newMedicalCondition);
    await this.PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Medical condition added to report successfully',
      data: newMedicalCondition,
    };
  }

  async updateMedicalConditionFromReport(
    medicalConditionId: number,
    updateMedicalConditionDto: UpdateMedicalConditionDto,
  ) {
    const medicalCondition = await this.medicalConditionRepository.findOne({
      where: { id: medicalConditionId },
    });

    if (!medicalCondition) {
      throw new NotFoundException(
        `Medical condition with id ${medicalConditionId} not found`,
      );
    }

    Object.assign(medicalCondition, updateMedicalConditionDto);
    const updatedMedicalCondition =
      await this.medicalConditionRepository.save(medicalCondition);

    return {
      status: HttpStatus.OK,
      message: 'Medical condition updated successfully',
      data: updatedMedicalCondition,
    };
  }

  async removeMedicalConditionFromReport(medicalConditionId: number) {
    await this.medicalConditionRepository.delete(medicalConditionId);

    return {
      status: HttpStatus.OK,
      message: 'Medical condition removed successfully',
    };
  }
}
