import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile as TenantProfile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { User as TenantUser } from 'src/entities/user.entity';
import { Profile as AdminProfile } from 'src/entities/main/profile.entity';
import { User as AdminUser } from 'src/entities/main/user.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([TenantUser, TenantProfile], 'secondary'),
    TypeOrmModule.forFeature([AdminProfile, AdminUser], 'primary'),
  ],

  controllers: [ProfileController],
  providers: [ProfileService, UserService, AdministratorService],
  exports: [ProfileService],
})
export class ProfileModule {}
