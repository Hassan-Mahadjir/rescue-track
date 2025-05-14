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
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { OrderStatus } from 'src/enums/orderStatus.enums';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { Unit } from 'src/entities/unit.entity';

@Injectable()
export class OrderService extends BaseHospitalService {
  constructor(
    protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
    super(request, databaseConnectionService);
  }

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const orderRepository = await this.getRepository(Order);
    const orderItemRepository = await this.getRepository(OrderItem);
    const supplierRepository = await this.getRepository(Supplier);
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);
    const unitRepository = await this.getRepository(Unit);

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
        const unit = await unitRepository.findOne({
          where: { abbreviation: itemDto.unit },
        });
        if (!unit) {
          throw new BadRequestException(`Unit ${itemDto.unit} does not exist`);
        }
        orderItem = orderItemRepository.create({
          order,
          medication,
          quantity: itemDto.quantity,
          unit, // Associate the unit
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
        const unit = await unitRepository.findOne({
          where: { abbreviation: itemDto.unit },
        });
        if (!unit) {
          throw new BadRequestException(`Unit ${itemDto.unit} does not exist`);
        }
        orderItem = orderItemRepository.create({
          order,
          equipment,
          quantity: itemDto.quantity,
          unit, // Associate the unit
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
        'orderItems.unit', // Include unit in the relations
        'supplier',
      ],
    });

    if (completeOrder?.supplier?.email) {
      const user = await this.userService.findOneWithProfile(
        completeOrder.createdById,
      );

      await this.mailService.sendOrderEmailToSupplier(
        completeOrder.supplier.email,
        completeOrder,
        user,
      );
      await this.mailService.sendOrderEmailToAdmin(user.email, completeOrder);
    }

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
        'orderItems.unit',
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
        'orderItems.unit',
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

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number) {
    const orderRepository = await this.getRepository(Order);
    const medicationRepository = await this.getRepository(Medication);
    const equipmentRepository = await this.getRepository(Equipment);
    const updateHistoryRepository = await this.getRepository(UpdateHistory);

    const order = await orderRepository.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.medication',
        'orderItems.equipment',
        'orderItems.unit', // Include unit in the relations
      ],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.RECEIVED) {
      throw new BadRequestException('Order is already received');
    }

    if (updateOrderDto.orderStatus === OrderStatus.RECEIVED) {
      for (const item of order.orderItems) {
        if (item.medication) {
          const medication = await medicationRepository.findOne({
            where: { id: item.medication.id },
          });
          if (!medication) {
            throw new NotFoundException(
              `Medication with id ${item.medication.id} not found`,
            );
          }
          const newStockQuantity = medication.stockQuantity + item.quantity;
          await medicationRepository.update(medication.id, {
            stockQuantity: newStockQuantity,
          });
        }
      }
    }

    Object.assign(order, { ...updateOrderDto, updatedById: userId });
    await orderRepository.save(order);

    const updateHistory = await updateHistoryRepository.create({
      order,
      updatedById: userId,
      updateFields: updateOrderDto,
    });
    await updateHistoryRepository.save(updateHistory);

    return {
      status: HttpStatus.OK,
      message: 'Order updated successfully',
      data: {
        updateFields: updateHistory.updateFields,
        updatedBy: updateHistory.updatedById,
      },
    };
  }

  async remove(id: number) {
    const orderRepository = await this.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.unit'], // Include unit in the relations
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
