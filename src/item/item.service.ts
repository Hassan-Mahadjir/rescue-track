import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEquipmentDto,
  CreateItemDto,
  CreateMedicationDto,
} from './dto/create-item.dto';
import { UpdateMedicationDto, UpdateEquipmentDto } from './dto/update-item.dto';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { Request } from 'express';
import { DatabaseConnectionService } from 'src/database/database.service';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';
import { TreatmentCategory } from 'src/enums/treatmentCategory.enums';
import { EquipmentType } from 'src/enums/equipmentType.enums';
import { Unit } from 'src/entities/unit.entity';

@Injectable()
export class ItemService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(
    userId: number,
    createItemDto: CreateMedicationDto | CreateEquipmentDto,
    itemType: 'medication' | 'equipment',
  ) {
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);
    const unitRepository = await this.getRepository(Unit);

    if (itemType === 'medication') {
      const medicationDto = createItemDto as CreateMedicationDto; // Type assertion for medication
      const unit = await unitRepository.findOne({
        where: { abbreviation: medicationDto.unit },
      });
      if (!unit) {
        throw new NotFoundException(
          `Unit ${medicationDto.unit} does not exist`,
        );
      }

      const medication = medicationRepository.create({
        ...medicationDto,
        createdById: userId,
        category: medicationDto.category as TreatmentCategory,
        unit, // Associate the unit
      });
      await medicationRepository.save(medication);
      return {
        status: HttpStatus.CREATED,
        message: 'Medication created successfully',
        data: medication,
      };
    } else if (itemType === 'equipment') {
      const equipment = equipmentRepository.create({
        ...createItemDto,
        createdById: userId,
        category: createItemDto.category as EquipmentType,
      });
      await equipmentRepository.save(equipment);
      return {
        status: HttpStatus.CREATED,
        message: 'Equipment created successfully',
        data: equipment,
      };
    }
  }

  async findAll() {
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);

    const medications = await medicationRepository.find({
      relations: ['supplier', 'unit'], // Include unit in relations
    });
    const equipments = await equipmentRepository.find({
      relations: ['supplier'],
    });

    return {
      status: HttpStatus.OK,
      message: `Items fetched successfully, ${medications.length} medications and ${equipments.length} equipments`,
      data: { medications, equipments },
    };
  }

  async findOne(id: number, itemType: 'medication' | 'equipment') {
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);

    if (itemType === 'medication') {
      const medication = await medicationRepository.findOne({
        where: { id },
        relations: ['supplier', 'unit'], // Include unit in relations
      });
      if (!medication) {
        throw new NotFoundException('Medication not found');
      }
      return {
        status: HttpStatus.FOUND,
        message: 'Medication fetched successfully',
        data: medication,
      };
    } else if (itemType === 'equipment') {
      const equipment = await equipmentRepository.findOne({
        where: { id },
        relations: ['supplier'],
      });
      if (!equipment) {
        throw new NotFoundException('Equipment not found');
      }
      return {
        status: HttpStatus.FOUND,
        message: 'Equipment fetched successfully',
        data: equipment,
      };
    }
  }

  update(id: number, updateItemDto: UpdateMedicationDto | UpdateEquipmentDto) {}

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
