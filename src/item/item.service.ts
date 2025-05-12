import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateEquipmentDto,
  CreateItemDto,
  CreateMedicationDto,
} from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { Request } from 'express';
import { DatabaseConnectionService } from 'src/database/database.service';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';

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

    if (itemType === 'medication') {
      const medication = medicationRepository.create(createItemDto);
      await medicationRepository.save(medication);
      return {
        status: HttpStatus.CREATED,
        message: 'Medication created successfully',
        data: medication,
      };
    } else if (itemType === 'equipment') {
      const equipment = equipmentRepository.create(createItemDto);
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
      relations: ['supplier'],
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
        relations: ['supplier'],
      });
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
      return {
        status: HttpStatus.FOUND,
        message: 'Equipment fetched successfully',
        data: equipment,
      };
    }
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
