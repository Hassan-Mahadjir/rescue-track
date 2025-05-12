import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { Hospital } from 'src/entities/main/hospital.entity';
import { Supplier } from 'src/entities/supplier.entity';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';
import { UserService } from 'src/user/user.service';
import { DatabaseConnectionService } from 'src/database/database.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    TypeOrmModule.forFeature([Supplier, Medication, Equipment], 'secondary'),
  ],
  controllers: [ItemController],
  providers: [ItemService, UserService, DatabaseConnectionService],
})
export class ItemModule {}
