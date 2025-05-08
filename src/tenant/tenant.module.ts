import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from 'src/entities/main/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner], 'primary')],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
