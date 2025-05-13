import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { Hospital } from 'src/entities/main/hospital.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';
import { Order } from 'src/entities/order.entity';
import { UserService } from 'src/user/user.service';
import { DatabaseConnectionService } from 'src/database/database.service';
import { OrderItem } from 'src/entities/order-item.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    TypeOrmModule.forFeature(
      [Supplier, Medication, Equipment, Order, OrderItem, UpdateHistory],
      'secondary',
    ),
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, UserService, DatabaseConnectionService],
})
export class OrderModule {}
