import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from 'src/entities/supplier.entity';
import { Medication } from 'src/entities/medication.entity';
import { Equipment } from 'src/entities/equipment.entity';
import { UserService } from 'src/user/user.service';
import { DatabaseConnectionService } from 'src/database/database.service';
import { User } from 'src/entities/main/user.entity';
import { Hospital } from 'src/entities/main/hospital.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { UpdateHistory } from 'src/entities/updateHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    TypeOrmModule.forFeature(
      [Supplier, Medication, Equipment, UpdateHistory],
      'secondary',
    ),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, UserService, DatabaseConnectionService],
  exports: [SupplierService],
})
export class SupplierModule {}
