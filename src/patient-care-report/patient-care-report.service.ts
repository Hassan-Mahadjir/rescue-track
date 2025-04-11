import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Repository } from 'typeorm';
import { Treatment } from 'src/entities/treatment.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from 'src/entities/patient.entity';
import { LessThan, MoreThan } from 'typeorm';
import { PatientUpdateHistory } from 'src/entities/patientUpdateHistory.entity';

@Injectable()
export class PatientCareReportService {
  constructor(
    @InjectRepository(PatientCareReport)
    private PCRRepository: Repository<PatientCareReport>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    private userService: UserService,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(PatientUpdateHistory)
    private updateHistoryRepository: Repository<PatientUpdateHistory>,
  ) {}
  async create(
    initiatedPersonId: number,
    createPatientCareReportDto: CreatePatientCareReportDto,
  ) {
    const initiatedPerson = await this.userService.findOne(initiatedPersonId);
    const patient = await this.patientRepository.findOne({
      where: { id: createPatientCareReportDto.patientId },
    });

    if (!patient)
      throw new NotFoundException(
        `Patient with ${createPatientCareReportDto.patientId} not found`,
      );

    const newPCR = this.PCRRepository.create({
      patient,
      treatments: createPatientCareReportDto.treatments.map((t) =>
        this.treatmentRepository.create(t),
      ),
      initiatedBy: initiatedPerson,
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
      relations: ['treatments', 'initiatedBy', 'initiatedBy.profile'],
    });

    return {
      status: HttpStatus.FOUND,
      message: `${reports.length} Patient care reports fetched successfully`,
      date: reports,
    };
  }

  async findOne(id: number) {
    const report = await this.PCRRepository.findOne({
      where: { id: id },
      relations: ['treatments', 'initiatedBy', 'initiatedBy.profile'],
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
      relations: ['treatments', 'initiatedBy', 'initiatedBy.profile'],
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
      relations: ['treatments', 'patient', 'initiatedBy'],
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
    const report = await this.PCRRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(
        `Patient care report with id ${id} not found`,
      );
    }

    await this.PCRRepository.remove(report);

    return {
      status: HttpStatus.OK,
      message: `Patient care report with id ${id} has been removed successfully`,
    };
  }
}
