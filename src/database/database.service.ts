import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Hospital } from 'src/entities/main/hospital.entity';
import * as path from 'path';

@Injectable()
export class DatabaseConnectionService implements OnModuleDestroy {
  private readonly connections: Map<string, DataSource> = new Map();
  private readonly logger = new Logger(DatabaseConnectionService.name);

  constructor(
    @InjectRepository(Hospital, 'primary')
    private hospitalRepository: Repository<Hospital>,
  ) {}

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
      logging: ['schema'], // Log schema changes
      migrations: [path.resolve(__dirname, '../migrations/*{.ts,.js}')],
      migrationsRun: false, // Don't run migrations automatically
    });

    try {
      await connection.initialize();
      this.logger.log(
        `Successfully initialized connection for hospital: ${hospital.name}`,
      );

      // Log the current schema state
      const queryRunner = connection.createQueryRunner();
      const tables = await queryRunner.getTables();
      // this.logger.log(
      //   `Current tables in ${hospital.name}: ${tables.map((t) => t.name).join(', ')}`,
      // );
      await queryRunner.release();

      this.connections.set(hospitalId, connection);
      return connection;
    } catch (error) {
      this.logger.error(
        `Failed to initialize connection for hospital ${hospital.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async reinitializeAllConnections(): Promise<void> {
    this.logger.log('Starting reinitialization of all database connections');

    // Close all existing connections
    for (const [hospitalId, connection] of this.connections.entries()) {
      if (connection.isInitialized) {
        this.logger.log(`Closing connection for hospital ID: ${hospitalId}`);
        await connection.destroy();
      }
    }
    this.connections.clear();

    // Get all hospitals and reinitialize their connections
    const hospitals = await this.hospitalRepository.find();
    this.logger.log(`Found ${hospitals.length} hospitals to reinitialize`);

    for (const hospital of hospitals) {
      try {
        await this.initializeConnection(hospital.id);
        this.logger.log(
          `Successfully reinitialized connection for hospital: ${hospital.name}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to reinitialize connection for hospital ${hospital.name}: ${error.message}`,
        );
        // Continue with other hospitals even if one fails
      }
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
