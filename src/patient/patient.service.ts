import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/entities/patient.entity';
import { Repository } from 'typeorm';
import { Gender } from 'src/enums/gender.enums';
import { Nationality } from 'src/enums/nationality.enums';
import { Status } from 'src/enums/status.enums';
import { UserService } from 'src/user/user.service';
import { UpdateHistory } from 'src/entities/updateHistory.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(UpdateHistory)
    private patientUpdateHistoryRepository: Repository<UpdateHistory>,
    private userService: UserService,
  ) {}
  async create(responsibleID: number, createPatientDto: CreatePatientDto) {
    const existingPatient = await this.patientRepository.findOne({
      where: { nationalID: createPatientDto.nationalID },
    });

    if (existingPatient) {
      throw new BadRequestException('Patient already exists');
    }

    // get responsible user
    const responsible = await this.userService.findOne(responsibleID);

    const newPatient = await this.patientRepository.create({
      ...createPatientDto,
      gender: createPatientDto.gender as Gender,
      nationality: createPatientDto.nationality as Nationality,
      status: createPatientDto.status as Status,
      responsible: responsible,
    });

    const savedPatient = await this.patientRepository.save(newPatient);

    return {
      status: HttpStatus.CREATED,
      message: 'Patient created successfully',
      data: savedPatient,
    };
  }

  async findAll() {
    const patients = await this.patientRepository.find({
      relations: ['responsible', 'updateHistory'],
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
    const patient = await this.patientRepository.findOne({
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

  async getPatient(patientId: number, responsibleId: number) {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId, responsible: { id: responsibleId } },
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

  async getPatients(responsibleId: number) {
    const patients = await this.patientRepository.find({
      where: { responsible: { id: responsibleId } },
      relations: ['responsible', 'updateHistory'],
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

  async update(id: number, updatePatientDto: UpdatePatientDto, userId: number) {
    const existingPatient = await this.patientRepository.findOne({
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

      existingPatient.responsible = newResponsible;
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

    const updatedPatient = await this.patientRepository.save(existingPatient);

    const updatedByUser = await this.userService.findOne(userId);
    if (!updatedByUser) {
      throw new NotFoundException('Updating user not found');
    }

    const history = this.patientUpdateHistoryRepository.create({
      patient: updatedPatient,
      updatedBy: updatedByUser,
      updateFields: updatePatientDto,
    });

    const savedupdate = await this.patientUpdateHistoryRepository.save(history);

    return {
      status: HttpStatus.OK,
      message: 'Patient updated successfully',
      data: savedupdate,
    };
  }

  async remove(id: number) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    patient.updateHistory = [];
    await this.patientRepository.save(patient);
    await this.patientRepository.delete(id);

    return {
      status: HttpStatus.OK,
      message: 'Patient deleted successfully',
    };
  }
}
