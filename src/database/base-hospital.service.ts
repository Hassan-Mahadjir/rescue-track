import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { DatabaseConnectionService } from './database.service';

@Injectable({ scope: Scope.REQUEST })
export abstract class BaseHospitalService {
  protected connection: DataSource;

  constructor(
    @Inject(REQUEST) protected readonly request: Request,
    protected readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  protected async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    if (!this.connection) {
      const hospitalId = this.request['hospitalId'];
      if (!hospitalId) {
        throw new Error('Hospital ID not found in request context');
      }
      this.connection =
        await this.databaseConnectionService.getHospitalConnection(hospitalId);
    }
    return this.connection.getRepository(entity);
  }
}
