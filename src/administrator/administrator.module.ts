import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/main/user.entity';
import { Profile } from '../entities/main/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [AdministratorController],
  providers: [AdministratorService],
})
export class AdministratorModule {}
