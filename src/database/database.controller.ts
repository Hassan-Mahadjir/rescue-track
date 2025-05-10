import { Controller } from '@nestjs/common';
import { DatabaseConnectionService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseConnectionService) {}
}
