import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Hospital } from 'src/entities/main/hospital.entity';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class DatabaseConnectionService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly connections: Map<string, DataSource> = new Map();
  private readonly logger = new Logger(DatabaseConnectionService.name);
  private isInitializing = false;
  private initializationPromise: Promise<void> | null = null;
  private static instance: DatabaseConnectionService;

  constructor(
    @InjectRepository(Hospital, 'primary')
    private hospitalRepository: Repository<Hospital>,
  ) {
    if (DatabaseConnectionService.instance) {
      return DatabaseConnectionService.instance;
    }
    DatabaseConnectionService.instance = this;
  }

  async onModuleInit() {
    if (this.isInitializing) {
      await this.initializationPromise;
      return;
    }

    if (this.connections.size > 0) {
      return;
    }

    this.isInitializing = true;
    this.initializationPromise = this.initializeAllConnections();

    try {
      await this.initializationPromise;
    } finally {
      this.isInitializing = false;
      this.initializationPromise = null;
    }
  }

  private async initializeAllConnections() {
    this.logger.log('Initializing database connections for all hospitals');
    const hospitals = await this.hospitalRepository.find();

    for (const hospital of hospitals) {
      if (this.connections.has(hospital.id)) {
        continue;
      }

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

      if (connection && !connection.isInitialized) {
        try {
          await connection.initialize();
          return connection;
        } catch (error) {
          this.logger.error(
            `Failed to reinitialize connection for hospital ${hospitalId}: ${error.message}`,
          );
          this.connections.delete(hospitalId);
        }
      }
    }

    this.logger.debug(`Creating new connection for hospital ${hospitalId}`);
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
