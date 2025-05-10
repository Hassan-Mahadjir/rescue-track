import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRunReportDto } from './dto/create-run-report.dto';
import { UpdateRunReportDto } from './dto/update-run-report.dto';
import { RunReport } from 'src/entities/run-report.entity';
import { MoreThan } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Patient } from 'src/entities/patient.entity';
import { Request } from 'express';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { DatabaseConnectionService } from 'src/database/database.service';

@Injectable()
export class RunReportService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
    private userService: UserService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(
    initiatedPersonId: number,
    createRunReportDto: CreateRunReportDto,
  ) {
    const runReportRepository = await this.getRepository(RunReport);
    const patientRepository = await this.getRepository(Patient);

    const initiatedPerson = await this.userService.findOne(initiatedPersonId);
    const patient = await patientRepository.findOne({
      where: { id: createRunReportDto.patientId },
    });

    if (!patient)
      throw new NotFoundException(
        `Patient with ${createRunReportDto.patientId} not found`,
      );

    const newRunReport = runReportRepository.create({
      ...createRunReportDto,
      patient: patient,
    });

    const savedRunReport = await runReportRepository.save(newRunReport);

    return {
      status: HttpStatus.CREATED,
      message: `Run report created successfully`,
      data: savedRunReport,
    };
  }

  async findAll() {
    const runReportRepository = await this.getRepository(RunReport);
    const reports = await runReportRepository.find({
      relations: [
        'initiatedBy.profile',
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
      ],
    });
    return {
      status: HttpStatus.FOUND,
      message: `${reports.length} Run reports fetched successfully`,
      data: reports,
    };
  }

  async findOne(id: number) {
    const runReportRepository = await this.getRepository(RunReport);
    const report = await runReportRepository.findOne({
      where: { id: id },
      relations: [
        'initiatedBy.profile',
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
      ],
    });

    if (!report)
      throw new NotFoundException(`Report with ${id} was not found.`);

    return {
      status: HttpStatus.FOUND,
      message: 'Run report found successfully',
      data: report,
    };
  }

  async getReportFromLast24Hours(id: number, userId: number) {
    const runReportRepository = await this.getRepository(RunReport);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const report = await runReportRepository.findOne({
      where: {
        id: id,
        createAt: MoreThan(twentyFourHoursAgo),
      },
      relations: [
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
      ],
    });

    if (!report)
      throw new NotFoundException(`No matching report found or access denied`);

    return {
      status: HttpStatus.FOUND,
      message: 'Run report found successfully.',
      data: report,
    };
  }

  async getReportsFromLast24Hours(initiatedByID: number) {
    const runReportRepository = await this.getRepository(RunReport);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const createdByUser = await this.userService.findOne(initiatedByID);

    const runReports = await runReportRepository.find({
      where: {
        createAt: MoreThan(twentyFourHoursAgo),
      },
      relations: [
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
      ],
    });

    if (!runReports)
      throw new NotFoundException(`No reports found in the last 24 hours`);

    return {
      status: HttpStatus.FOUND,
      message: `${runReports.length} run reports found successfully.`,
      data: runReports,
    };
  }

  async update(id: number, updateRunReportDto: UpdateRunReportDto) {
    const runReportRepository = await this.getRepository(RunReport);
    const patientRepository = await this.getRepository(Patient);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const report = await runReportRepository.findOne({
      where: { id: id },
      relations: [
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
        'initiatedBy',
      ],
    });

    if (!report)
      throw new NotFoundException(`Run report with id ${id} not found`);

    // Optional: Update patient if patientId provided
    if (updateRunReportDto.patientId) {
      const patient = await patientRepository.findOne({
        where: { id: updateRunReportDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(
          `Patient with id ${updateRunReportDto.patientId} not found`,
        );
      }
      report.patient = patient;
    }

    // Update the report with the new data
    Object.assign(report, updateRunReportDto);
    const updatedReport = await runReportRepository.save(report);

    const history = updateHistoryRepository.create({
      runReport: report,
      updateFields: updateRunReportDto,
    });

    const savedUpdate = await updateHistoryRepository.save(history);

    return {
      status: HttpStatus.OK,
      message: 'Run report updated successfully',
      data: savedUpdate,
    };
  }

  async remove(id: number) {
    const runReportRepository = await this.getRepository(RunReport);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const report = await runReportRepository.findOne({
      where: { id: id },
      relations: [
        'patient',
        'updateHistory',
        'patient.patientCareReport',
        'patient.patientCareReport.treatments',
        'initiatedBy',
      ],
    });

    if (!report) {
      throw new NotFoundException(`run report with id ${id} not found`);
    }

    if (report.updateHistory.length > 0) {
      await updateHistoryRepository.remove(report.updateHistory);
    }

    await runReportRepository.remove(report);

    return {
      status: HttpStatus.OK,
      message: `Run with id ${id} has been successfully removed`,
    };
  }

  async getRecentReports() {
    const runReportRepository = await this.getRepository(RunReport);
    // Get all run reports with their relations
    const allReports = await runReportRepository.find({
      relations: [
        'patient',
        'initiatedBy.profile',
        'updateHistory',
        'patientCareReport',
      ],
      order: {
        createAt: 'DESC',
      },
    });

    // Filter out reports that are assigned to PCRs and get the most recent for each patient
    const recentReportsByPatient = new Map<number, RunReport>();

    for (const report of allReports) {
      // Skip if report is already assigned to a PCR
      if (report.patientCareReport) continue;

      // Skip if patient is not defined
      if (!report.patient?.id) continue;

      // Skip if createAt is not defined
      if (!report.createAt) continue;

      const existingReport = recentReportsByPatient.get(report.patient.id);
      // If we haven't seen this patient's report yet or this report is more recent
      if (!existingReport || report.createAt > existingReport.createAt) {
        recentReportsByPatient.set(report.patient.id, report);
      }
    }

    return {
      status: HttpStatus.FOUND,
      message: `${recentReportsByPatient.size} recent run reports found successfully`,
      data: Array.from(recentReportsByPatient.values()),
    };
  }
}
