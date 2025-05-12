import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { DatabaseConnectionService } from 'src/database/database.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { Supplier } from 'src/entities/supplier.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';

@Injectable()
export class SupplierService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
    private userService: UserService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(userId: number, createSupplierDto: CreateSupplierDto) {
    const supplierRepository = await this.getRepository(Supplier);

    const supplier = await supplierRepository.findOne({
      where: { email: createSupplierDto.email },
    });

    if (supplier) throw new BadRequestException('Supplier already exists');

    const newSupplier = supplierRepository.create({
      ...createSupplierDto,
      createdById: userId,
    });

    await supplierRepository.save(newSupplier);
    return {
      status: HttpStatus.CREATED,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll() {
    const supplierRepository = await this.getRepository(Supplier);
    const suppliers = await supplierRepository.find({
      relations: ['updateHistory'],
    });
    return {
      status: HttpStatus.OK,
      message: `${suppliers.length} Suppliers fetched successfully`,
      data: suppliers,
    };
  }

  async findOne(id: number) {
    const supplierRepository = await this.getRepository(Supplier);
    const supplier = await supplierRepository.findOne({
      where: { id },
      relations: ['updateHistory'],
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return {
      status: HttpStatus.FOUND,
      message: 'Supplier fetched successfully',
      data: supplier,
    };
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
    updatedById: number,
  ) {
    const supplierRepository = await this.getRepository(Supplier);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const supplier = await supplierRepository.findOne({
      where: { id },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');

    Object.assign(supplier, { ...updateSupplierDto, updatedById: updatedById });
    await supplierRepository.save(supplier);

    const history = updateHistoryRepository.create({
      supplier: supplier,
      updateFields: updateSupplierDto,
      updatedById: updatedById,
    });
    await updateHistoryRepository.save(history);
    return {
      status: HttpStatus.OK,
      message: 'Supplier updated successfully',
      data: {
        updateFields: history.updateFields,
        updatedBy: history.updatedById,
      },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
