import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Hospital } from 'src/entities/main/hospital.entity';
import * as path from 'path';

@Injectable()
export class DatabaseConnectionService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly connections: Map<string, DataSource> = new Map();
  private readonly logger = new Logger(DatabaseConnectionService.name);

  constructor(
    @InjectRepository(Hospital, 'primary')
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing database connections for all hospitals');
    const hospitals = await this.hospitalRepository.find();

    for (const hospital of hospitals) {
      try {
        await this.initializeConnection(hospital.id);
        this.logger.log(
          `Successfully initialized connection for hospital: ${hospital.name}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to initialize connection for hospital ${hospital.name}: ${error.message}`,
        );
      }
    }
  }

  async getHospitalConnection(hospitalId: string): Promise<DataSource> {
    if (this.connections.has(hospitalId)) {
      const connection = this.connections.get(hospitalId);
      if (connection && connection.isInitialized) {
        return connection;
      }
    }

    return await this.initializeConnection(hospitalId);
  }

  private async initializeConnection(hospitalId: string): Promise<DataSource> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new Error(`Hospital with ID ${hospitalId} not found`);
    }

    this.logger.log(`Initializing connection for hospital: ${hospital.name}`);

    const connection = new DataSource({
      type: 'postgres',
      url: hospital.databaseUrl,
      entities: [path.resolve(__dirname, '../entities/*.entity{.ts,.js}')],
      synchronize: true,
      logging: ['schema'],
      migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
      migrationsRun: false,
      poolSize: 20,
    });

    try {
      await connection.initialize();
      this.logger.log(
        `Successfully initialized connection for hospital: ${hospital.name}`,
      );
      this.connections.set(hospitalId, connection);
      return connection;
    } catch (error) {
      this.logger.error(
        `Failed to initialize connection for hospital ${hospital.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateEntitySchema(hospitalId: string): Promise<void> {
    const connection = await this.getHospitalConnection(hospitalId);
    if (connection) {
      this.logger.log(`Updating schema for hospital: ${hospitalId}`);
      await connection.synchronize();
      this.logger.log(
        `Schema updated successfully for hospital: ${hospitalId}`,
      );
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing all database connections');
    for (const connection of this.connections.values()) {
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }
    this.connections.clear();
  }
}
