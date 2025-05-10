import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseConnectionService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/entities/main/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital], 'primary')],
  controllers: [DatabaseController],
  providers: [DatabaseConnectionService],
})
export class DatabaseModule {}
