import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientCareReportDto } from './dto/create-patient-care-report.dto';
import { UpdatePatientCareReportDto } from './dto/update-patient-care-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientCareReport } from 'src/entities/patient-care-report.entity';
import { Repository } from 'typeorm';
import { Treatment } from 'src/entities/treatment.entity';
import { UserService } from 'src/user/user.service';
import { PatientService } from 'src/patient/patient.service';
import { Patient } from 'src/entities/patient.entity';

@Injectable()
export class PatientCareReportService {
  constructor(
    @InjectRepository(PatientCareReport)
    private PCRRepository: Repository<PatientCareReport>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    private userService: UserService,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  ) {}
  async create(
    responsibleId: number,
    createPatientCareReportDto: CreatePatientCareReportDto,
  ) {
    const responsible = await this.userService.findOne(responsibleId);
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
    });
    const savedPCR = await this.PCRRepository.save(newPCR);

    return {
      status: HttpStatus.CREATED,
      message: 'Patient care report created successfully',
      data: savedPCR,
    };
  }

  findAll() {
    return `This action returns all patientCareReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patientCareReport`;
  }

  update(id: number, updatePatientCareReportDto: UpdatePatientCareReportDto) {
    return `This action updates a #${id} patientCareReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} patientCareReport`;
  }
}
