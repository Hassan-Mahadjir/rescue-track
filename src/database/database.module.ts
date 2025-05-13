import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database.service';
import { Hospital } from '../entities/main/hospital.entity';
import { ConnectionMonitorService } from './connection-monitor.service';
import { ConnectionMonitorController } from './connection-monitor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital], 'primary')],
  providers: [DatabaseConnectionService, ConnectionMonitorService],
  exports: [DatabaseConnectionService],
  controllers: [ConnectionMonitorController],
})
export class DatabaseModule {}
