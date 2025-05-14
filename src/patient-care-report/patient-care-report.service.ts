import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Treatment } from 'src/entities/treatment.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from 'src/entities/patient.entity';
import { In, LessThan, MoreThan } from 'typeorm';
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
import { Request } from 'express';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { DatabaseConnectionService } from 'src/database/database.service';
import { Unit } from 'src/entities/unit.entity';

@Injectable()
export class PatientCareReportService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
    private userService: UserService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(
    initiatedPersonId: number,
    createPatientCareReportDto: CreatePatientCareReportDto,
  ) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const runReportRepository = await this.getRepository(RunReport);
    const patientRepository = await this.getRepository(Patient);
    const treatmentRepository = await this.getRepository(Treatment);
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);
    const allergyRepository = await this.getRepository(Allergy);
    const unitRepository = await this.getRepository(Unit);

    const runReport = await runReportRepository.findOne({
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

    const patient = await patientRepository.findOne({
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

    const treatments = await Promise.all(
      createPatientCareReportDto.treatments.map(async (t) => {
        let unit = await unitRepository.findOne({
          where: { abbreviation: t.unit },
        });
        if (!unit) {
          throw new NotFoundException('Unit is not defined in the database.');
        }
        const treatment = treatmentRepository.create({ ...t, unit });
        return await treatmentRepository.save(treatment);
      }),
    );
    const medicalConditions = await Promise.all(
      createPatientCareReportDto.medicalConditions.map(async (mc) => {
        const condition = medicalConditionRepository.create(mc);
        return await medicalConditionRepository.save(condition);
      }),
    );

    const allergies = await Promise.all(
      createPatientCareReportDto.allergies.map(async (a) => {
        const allergy = allergyRepository.create(a);
        return await allergyRepository.save(allergy);
      }),
    );

    const newPCR = PCRRepository.create({
      ...createPatientCareReportDto,
      patient,
      createdById: initiatedPersonId,
      treatments: treatments,
      medicalConditions: medicalConditions,
      allergies: allergies,
      runReport,
    });

    const savedPCR = await PCRRepository.save(newPCR);

    return {
      status: HttpStatus.CREATED,
      message: 'Patient care report created successfully',
      data: savedPCR,
    };
  }

  async findAll() {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const reports = await PCRRepository.find({
      relations: [
        'treatments',
        'treatments.unit',
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
    const PCRRepository = await this.getRepository(PatientCareReport);
    const report = await PCRRepository.findOne({
      where: { id: id },
      relations: [
        'treatments',
        'treatments.unit',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });

    if (!report)
      throw new NotFoundException(`Report with ${id} was not found.`);

    const initiatedBy = await this.userService.findOneWithProfile(
      report.createdById,
    );

    return {
      status: HttpStatus.FOUND,
      message: 'Patient care report found successfully',
      data: { report, initiatedBy },
    };
  }

  async getReportFromLast24Hours(id: number, userId: number) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const PCR = await PCRRepository.findOne({
      where: {
        id: id,
        createdAt: MoreThan(twentyFourHoursAgo),
        createdById: userId,
      },
      relations: [
        'treatments',
        'treatments.unit',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });
    if (!PCR)
      throw new NotFoundException(`No matching report found or access denied`);

    const initiatedBy = await this.userService.findOneWithProfile(
      PCR.createdById,
    );

    return {
      status: HttpStatus.FOUND,
      message: 'Patient care report found successfully.',
      data: { PCR, initiatedBy },
    };
  }

  async getReportsFromLast24Hours(initiatedByID: number) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const PCRs = await PCRRepository.find({
      where: {
        createdAt: MoreThan(twentyFourHoursAgo),
        createdById: initiatedByID,
      },
      relations: [
        'treatments',
        'treatments.unit',
        'patient',
        'allergies',
        'medicalConditions',
      ],
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
    updatedById: number,
  ) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const patientRepository = await this.getRepository(Patient);
    const treatmentRepository = await this.getRepository(Treatment);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);
    const allergyRepository = await this.getRepository(Allergy);
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);

    const report = await PCRRepository.findOne({
      where: { id },
      relations: [
        'treatments',
        'treatments.unit',
        'patient',
        'allergies',
        'medicalConditions',
      ],
    });

    if (!report) {
      throw new NotFoundException(
        `Patient care report with id ${id} not found`,
      );
    }

    // Update treatments if provided
    if (updatePatientCareReportDto.treatments) {
      const existingTreatments = await treatmentRepository.find({
        where: {
          name: In(updatePatientCareReportDto.treatments.map((t) => t.name)),
        },
        relations: ['unit'], // Include unit in the relations
      });

      const missingTreatments = updatePatientCareReportDto.treatments
        .filter(
          (treatment) =>
            !existingTreatments.some((et) => et.name === treatment.name),
        )
        .map((t) => t.name);

      if (missingTreatments.length > 0) {
        throw new BadRequestException(
          `The following treatments do not exist in the database: ${missingTreatments.join(', ')}`,
        );
      }

      report.treatments = existingTreatments;
    }

    // Update allergies if provided
    if (updatePatientCareReportDto.allergies) {
      const existingAllergies = await allergyRepository.find({
        where: {
          name: In(updatePatientCareReportDto.allergies.map((a) => a.name)),
        },
      });

      const missingAllergies = updatePatientCareReportDto.allergies
        .filter(
          (allergy) =>
            !existingAllergies.some((ea) => ea.name === allergy.name),
        )
        .map((a) => a.name);

      if (missingAllergies.length > 0) {
        throw new BadRequestException(
          `The following allergies do not exist in the database: ${missingAllergies.join(', ')}`,
        );
      }

      report.allergies = existingAllergies;
    }

    // Update medical conditions if provided
    if (updatePatientCareReportDto.medicalConditions) {
      const existingMedicalConditions = await medicalConditionRepository.find({
        where: {
          name: In(
            updatePatientCareReportDto.medicalConditions.map((m) => m.name),
          ),
        },
      });

      const missingMedicalConditions =
        updatePatientCareReportDto.medicalConditions
          .filter(
            (condition) =>
              !existingMedicalConditions.some(
                (em) => em.name === condition.name,
              ),
          )
          .map((m) => m.name);

      if (missingMedicalConditions.length > 0) {
        throw new BadRequestException(
          `The following medical conditions do not exist in the database: ${missingMedicalConditions.join(', ')}`,
        );
      }

      report.medicalConditions = existingMedicalConditions;
    }

    // Update patient if patientId is provided
    if (updatePatientCareReportDto.patientId) {
      const patient = await patientRepository.findOne({
        where: { id: updatePatientCareReportDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(
          `Patient with id ${updatePatientCareReportDto.patientId} not found`,
        );
      }

      report.patient = patient;
    }

    await PCRRepository.save({
      ...report,
      updatedById: updatedById,
    });

    const history = updateHistoryRepository.create({
      patientCareReport: report,
      updateFields: updatePatientCareReportDto,
      updatedById: updatedById,
    });

    const savedHistory = await updateHistoryRepository.save(history);

    return {
      status: HttpStatus.OK,
      message: 'Patient care report updated successfully',
      data: {
        updateFields: savedHistory.updateFields,
        updatedBy: savedHistory.updatedById,
      },
    };
  }

  async remove(id: number) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const runReportRepository = await this.getRepository(RunReport);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const report = await PCRRepository.findOne({
      where: { id },
      relations: [
        'treatments',
        'updateHistory',
        'allergies',
        'medicalConditions',
        'runReport',
      ],
    });

    if (!report) {
      throw new NotFoundException(`PatientCareReport with id ${id} not found`);
    }

    // Remove the relationship by updating the Run Report
    if (report.runReport) {
      const runReport = await runReportRepository.findOne({
        where: { id: report.runReport.id },
      });
      if (runReport) {
        runReport.patientCareReport = null;
        await runReportRepository.save(runReport);
      }
    }

    if (report.updateHistory?.length > 0) {
      await updateHistoryRepository.remove(report.updateHistory);
    }

    // Clear the many-to-many relationships
    if (report.treatments.length > 0) {
      report.treatments = [];
    }

    if (report.allergies.length > 0) {
      report.allergies = [];
    }

    if (report.medicalConditions.length > 0) {
      report.medicalConditions = [];
    }

    // Save the report with cleared relationships
    await PCRRepository.save(report);

    // Finally remove the report
    await PCRRepository.remove(report);

    return {
      status: HttpStatus.OK,
      message: `PatientCareReport with id ${id} has been successfully removed`,
    };
  }

  async addTreatmentToReport(
    reportId: number,
    createTreatmentDto: TreatmentDto,
  ) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const treatmentRepository = await this.getRepository(Treatment);
    const unitRepository = await this.getRepository(Unit);

    const report = await PCRRepository.findOne({
      where: { id: reportId },
      relations: ['treatments'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    // Check if the treatment already exists
    let treatment = await treatmentRepository.findOne({
      where: { name: createTreatmentDto.name },
      relations: ['unit'],
    });

    const unit = await unitRepository.findOne({
      where: { abbreviation: createTreatmentDto.unit },
    });

    if (!unit) {
      throw new BadRequestException(
        `Unit ${createTreatmentDto.unit} does not exist`,
      );
    }
    // Create a new treatment
    treatment = treatmentRepository.create({
      name: createTreatmentDto.name,
      quantity: createTreatmentDto.quantity,
      category: createTreatmentDto.category,
      unit,
    });

    await treatmentRepository.save(treatment);

    report.treatments.push(treatment);
    await PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Treatment added to report successfully',
      data: treatment,
    };
  }

  async updateTreatmentFromReport(
    treatmentId: number,
    updateTreatmentDto: UpdateTreatmentDto,
  ) {
    const treatmentRepository = await this.getRepository(Treatment);
    const unitRepository = await this.getRepository(Unit);

    const treatment = await treatmentRepository.findOne({
      where: { id: treatmentId },
      relations: ['unit'],
    });

    if (!treatment) {
      throw new NotFoundException(`Treatment with id ${treatmentId} not found`);
    }

    // Update the unit if provided
    if (updateTreatmentDto.unit) {
      const unit = await unitRepository.findOne({
        where: { abbreviation: updateTreatmentDto.unit },
      });

      if (!unit) {
        throw new BadRequestException(
          `Unit ${updateTreatmentDto.unit} does not exist`,
        );
      }

      treatment.unit = unit;
    }

    Object.assign(treatment, updateTreatmentDto);
    const updatedTreatment = await treatmentRepository.save(treatment);

    return {
      status: HttpStatus.OK,
      message: 'Treatment updated successfully',
      data: updatedTreatment,
    };
  }

  async removeTreatmentFromReport(treatmentId: number) {
    const treatmentRepository = await this.getRepository(Treatment);
    const treatment = await treatmentRepository.findOne({
      where: { id: treatmentId },
      relations: ['PCR', 'unit'], // Include unit in the relations
    });

    if (!treatment) {
      throw new NotFoundException(`Treatment with id ${treatmentId} not found`);
    }

    // Remove the treatment from all associated PCRs
    treatment.PCR = [];
    await treatmentRepository.save(treatment);

    return {
      status: HttpStatus.OK,
      message: 'Treatment removed successfully',
    };
  }

  async addAllergyToReport(
    reportId: number,
    createAllergyDto: CreateAllergyDto,
  ) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const allergyRepository = await this.getRepository(Allergy);

    const report = await PCRRepository.findOne({
      where: { id: reportId },
      relations: ['allergies'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    const existingAllergy = await allergyRepository.findOne({
      where: { name: createAllergyDto.name },
    });

    if (!existingAllergy) {
      throw new BadRequestException(
        `Allergy with name ${createAllergyDto.name} does not exist in the database`,
      );
    }

    report.allergies.push(existingAllergy);
    await PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Allergy added to report successfully',
      data: existingAllergy,
    };
  }

  async updateAllergyFromReport(
    allergyId: number,
    updateAllergyDto: UpdateAllergyDto,
  ) {
    const allergyRepository = await this.getRepository(Allergy);

    const allergy = await allergyRepository.findOne({
      where: { id: allergyId },
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with id ${allergyId} not found`);
    }

    Object.assign(allergy, updateAllergyDto);
    const updatedAllergy = await allergyRepository.save(allergy);

    return {
      status: HttpStatus.OK,
      message: 'Allergy updated successfully',
      data: updatedAllergy,
    };
  }

  async removeAllergyFromReport(allergyId: number) {
    const allergyRepository = await this.getRepository(Allergy);
    const allergy = await allergyRepository.findOne({
      where: { id: allergyId },
      relations: ['PCR'],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with id ${allergyId} not found`);
    }

    // Remove the allergy from all associated PCRs
    allergy.PCR = [];
    await allergyRepository.save(allergy);

    return {
      status: HttpStatus.OK,
      message: 'Allergy removed successfully',
    };
  }

  async addMedicalConditionToReport(
    reportId: number,
    createMedicalConditionDto: CreateMedicalConditionDto,
  ) {
    const PCRRepository = await this.getRepository(PatientCareReport);
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);

    const report = await PCRRepository.findOne({
      where: { id: reportId },
      relations: ['medicalConditions'],
    });

    if (!report) {
      throw new NotFoundException(`Report with id ${reportId} not found`);
    }

    const existingMedicalCondition = await medicalConditionRepository.findOne({
      where: { name: createMedicalConditionDto.name },
    });

    if (!existingMedicalCondition) {
      throw new BadRequestException(
        `Medical condition with name ${createMedicalConditionDto.name} does not exist in the database`,
      );
    }

    report.medicalConditions.push(existingMedicalCondition);
    await PCRRepository.save(report);

    return {
      status: HttpStatus.CREATED,
      message: 'Medical condition added to report successfully',
      data: existingMedicalCondition,
    };
  }

  async updateMedicalConditionFromReport(
    medicalConditionId: number,
    updateMedicalConditionDto: UpdateMedicalConditionDto,
  ) {
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);

    const medicalCondition = await medicalConditionRepository.findOne({
      where: { id: medicalConditionId },
    });

    if (!medicalCondition) {
      throw new NotFoundException(
        `Medical condition with id ${medicalConditionId} not found`,
      );
    }

    Object.assign(medicalCondition, updateMedicalConditionDto);
    const updatedMedicalCondition =
      await medicalConditionRepository.save(medicalCondition);

    return {
      status: HttpStatus.OK,
      message: 'Medical condition updated successfully',
      data: updatedMedicalCondition,
    };
  }

  async removeMedicalConditionFromReport(medicalConditionId: number) {
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);
    const medicalCondition = await medicalConditionRepository.findOne({
      where: { id: medicalConditionId },
      relations: ['PCR'],
    });

    if (!medicalCondition) {
      throw new NotFoundException(
        `Medical condition with id ${medicalConditionId} not found`,
      );
    }

    // Remove the medical condition from all associated PCRs
    medicalCondition.PCR = [];
    await medicalConditionRepository.save(medicalCondition);

    return {
      status: HttpStatus.OK,
      message: 'Medical condition removed successfully',
    };
  }

  async createTreatments(createTreatmentDto: TreatmentDto[]) {
    const treatmentRepository = await this.getRepository(Treatment);
    const unitRepository = await this.getRepository(Unit);

    for (const treatmentDto of createTreatmentDto) {
      // Check if the treatment already exists
      const existingTreatment = await treatmentRepository.findOne({
        where: { name: treatmentDto.name },
      });

      if (!existingTreatment) {
        // Find the unit
        const unit = await unitRepository.findOne({
          where: { abbreviation: treatmentDto.unit },
        });

        if (!unit) {
          throw new BadRequestException(
            `Unit ${treatmentDto.unit} does not exist`,
          );
        }

        // Create new treatment
        const newTreatment = treatmentRepository.create({
          name: treatmentDto.name,
          quantity: treatmentDto.quantity,
          category: treatmentDto.category,
          unit, // Associate the unit
        });

        await treatmentRepository.save(newTreatment);
      }
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Treatments created successfully',
    };
  }

  async createMedicalConditions(
    createMedicalConditionDto: CreateMedicalConditionDto[],
  ) {
    const medicalConditionRepository =
      await this.getRepository(MedicalCondition);
    for (let index = 0; index < createMedicalConditionDto.length; index++) {
      let medicalCondition = createMedicalConditionDto[index];
      const existingMedicalCondition = await medicalConditionRepository.findOne(
        { where: { name: medicalCondition.name } },
      );
      if (!existingMedicalCondition) {
        let newMedicalCondition =
          medicalConditionRepository.create(medicalCondition);
        await medicalConditionRepository.save(newMedicalCondition);
      }
    }
    return {
      status: HttpStatus.CREATED,
      message: 'Medical conditions created successfully',
    };
  }

  async createAllergies(createAllergyDto: CreateAllergyDto[]) {
    const allergyRepository = await this.getRepository(Allergy);
    for (let index = 0; index < createAllergyDto.length; index++) {
      let allergy = createAllergyDto[index];
      const existingAllergy = await allergyRepository.findOne({
        where: { name: allergy.name },
      });
      if (!existingAllergy) {
        let newAllergy = allergyRepository.create(allergy);
        await allergyRepository.save(newAllergy);
      }
    }
    return {
      status: HttpStatus.CREATED,
      message: 'Allergies created successfully',
    };
  }
}
