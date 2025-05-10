import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from 'src/entities/patient.entity';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { Status } from 'src/enums/status.enums';
import { UserService } from 'src/user/user.service';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { Request } from 'express';
import { DatabaseConnectionService } from 'src/database/database.service';
import { BaseHospitalService } from 'src/database/base-hospital.service';

@Injectable()
export class PatientService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
    private userService: UserService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(responsibleID: number, createPatientDto: CreatePatientDto) {
    const patientRepository = await this.getRepository(Patient);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const existingPatient = await patientRepository.findOne({
      where: { nationalID: createPatientDto.nationalID },
    });

    if (existingPatient) {
      throw new BadRequestException('Patient already exists');
    }

    // get responsible user
    const responsible = await this.userService.findOne(responsibleID);

    const newPatient = patientRepository.create({
      ...createPatientDto,
      gender: createPatientDto.gender as Gender,
      nationality: createPatientDto.nationality as Nationality,
      status: createPatientDto.status as Status,
      hospitalId: responsible.hospital.id,
      createdById: responsible.id,
      responsibleUserId: responsible.id,
    });

    const savedPatient = await patientRepository.save(newPatient);

    return {
      status: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: savedPatient,
    };
  }

  async findAll() {
    const patientRepository = await this.getRepository(Patient);
    const patients = await patientRepository.find({
      relations: ['updateHistory'],
    });

    if (!patients || patients.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No patients found',
        data: null,
      };
    }
    return {
      status: HttpStatus.FOUND,
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  async findOne(id: number) {
    const patientRepository = await this.getRepository(Patient);
    const patient = await patientRepository.findOne({
      where: { id },
      relations: ['responsible', 'updateHistory'],
    });

    if (!patient) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Patient not found',
        data: null,
      };
    }
    return {
      status: HttpStatus.FOUND,
      message: 'Patient retrieved successfully',
      data: patient,
    };
  }

  async update(id: number, updatePatientDto: UpdatePatientDto, userId: number) {
    const patientRepository = await this.getRepository(Patient);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const existingPatient = await patientRepository.findOne({
      where: { id },
      relations: ['responsible'],
    });

    if (!existingPatient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if new responsible is provided and valid
    if (updatePatientDto.newResponsibleID) {
      const newResponsible = await this.userService.findOne(
        updatePatientDto.newResponsibleID,
      );

      if (!newResponsible) {
        throw new BadRequestException('New responsible user not found');
      }
    }

    // Merge the updates into the existing patient
    Object.assign(existingPatient, {
      ...updatePatientDto,
      gender: (updatePatientDto.gender as Gender) || existingPatient.gender,
      nationality:
        (updatePatientDto.nationality as Nationality) ||
        existingPatient.nationality,
      status: (updatePatientDto.status as Status) || existingPatient.status,
    });

    const updatedPatient = await patientRepository.save(existingPatient);

    const updatedByUser = await this.userService.findOne(userId);
    if (!updatedByUser) {
      throw new NotFoundException('Updating user not found');
    }

    const history = updateHistoryRepository.create({
      patient: updatedPatient,
      updateFields: updatePatientDto,
    });

    const savedupdate = await updateHistoryRepository.save(history);

    return {
      status: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: savedupdate,
    };
  }

  async remove(id: number) {
    const patientRepository = await this.getRepository(Patient);
    const patient = await patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    patient.updateHistory = [];
    await patientRepository.save(patient);
    await patientRepository.delete(id);

    return {
      status: HttpStatus.OK,
      message: 'Patient deleted successfully',
    };
  }
}
