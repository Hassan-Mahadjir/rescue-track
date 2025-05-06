import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
