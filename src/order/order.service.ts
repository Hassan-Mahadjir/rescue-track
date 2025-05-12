import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseHospitalService } from 'src/database/base-hospital.service';
import { DatabaseConnectionService } from 'src/database/database.service';
import { Request } from 'express';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';

@Injectable()
export class OrderService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const orderRepository = await this.getRepository(Order);
    const orderItemRepository = await this.getRepository(OrderItem);
    const supplierRepository = await this.getRepository(Supplier);
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);

    // Validate supplier exists
    const supplier = await supplierRepository.findOne({
      where: { id: createOrderDto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Create the order
    const order = orderRepository.create({
      supplier,
      notes: createOrderDto.notes,
      createdById: userId,
    });
    await orderRepository.save(order);

    // Process order items
    for (const itemDto of createOrderDto.orderItems) {
      if (!itemDto.medicationId && !itemDto.equipmentId) {
        throw new BadRequestException(
          'Order item must have either medicationId or equipmentId',
        );
      }
      if (itemDto.medicationId && itemDto.equipmentId) {
        throw new BadRequestException(
          'Order item cannot have both medicationId and equipmentId',
        );
      }

      let orderItem: OrderItem;

      if (itemDto.medicationId) {
        const medication = await medicationRepository.findOne({
          where: { id: itemDto.medicationId },
        });
        if (!medication) {
          throw new NotFoundException(
            `Medication with id ${itemDto.medicationId} not found`,
          );
        }
        orderItem = orderItemRepository.create({
          order,
          medication,
          quantity: itemDto.quantity,
        });
      } else {
        const equipment = await equipmentRepository.findOne({
          where: { id: itemDto.equipmentId },
        });
        if (!equipment) {
          throw new NotFoundException(
            `Equipment with id ${itemDto.equipmentId} not found`,
          );
        }
        orderItem = orderItemRepository.create({
          order,
          equipment,
          quantity: itemDto.quantity,
        });
      }

      await orderItemRepository.save(orderItem);
    }

    // Fetch the complete order with items
    const completeOrder = await orderRepository.findOne({
      where: { id: order.id },
      relations: [
        'orderItems',
        'orderItems.medication',
        'orderItems.equipment',
        'supplier',
      ],
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: completeOrder,
    };
  }

  async findAll() {
    const orderRepository = await this.getRepository(Order);
    const orders = await orderRepository.find({
      relations: [
        'orderItems',
        'orderItems.medication',
        'orderItems.equipment',
        'supplier',
      ],
    });
    return {
      status: HttpStatus.OK,
      message: `${orders.length} Orders fetched successfully`,
      data: orders,
    };
  }

  async findOne(id: number) {
    const orderRepository = await this.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.medication',
        'orderItems.equipment',
        'supplier',
      ],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      status: HttpStatus.OK,
      message: 'Order fetched successfully',
      data: order,
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const orderRepository = await this.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, updateOrderDto);
    await orderRepository.save(order);

    return {
      status: HttpStatus.OK,
      message: 'Order updated successfully',
      data: order,
    };
  }

  async remove(id: number) {
    const orderRepository = await this.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await orderRepository.remove(order);
    return {
      status: HttpStatus.OK,
      message: 'Order deleted successfully',
    };
  }
}
