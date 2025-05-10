import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Hospital } from 'src/entities/main/hospital.entity';
import * as path from 'path';

@Injectable()
export class DatabaseConnectionService implements OnModuleDestroy {
  private readonly connections: Map<string, DataSource> = new Map();

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

    const hospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new Error(`Hospital with ID ${hospitalId} not found`);
    }

    const connection = new DataSource({
      type: 'postgres',
      url: hospital.databaseUrl,
      entities: [path.resolve(__dirname, '../entities/*.entity{.ts,.js}')],
      synchronize: true,
    });

    await connection.initialize();
    this.connections.set(hospitalId, connection);
    return connection;
  }

  async onModuleDestroy() {
    // Close all connections when the application shuts down
    for (const connection of this.connections.values()) {
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }
    this.connections.clear();
  }
}
