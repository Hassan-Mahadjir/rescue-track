import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile as TenantProfile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { User as TenantUser } from 'src/entities/user.entity';
import { Profile as OwnerProfile } from 'src/entities/main/profile.entity';
import { Owner } from 'src/entities/main/owner.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([TenantUser, TenantProfile], 'secondary'),
    TypeOrmModule.forFeature([OwnerProfile, Owner], 'primary'),
    MailModule,
  ],

  controllers: [ProfileController],
  providers: [ProfileService, UserService, AdministratorService],
  exports: [ProfileService],
})
export class ProfileModule {}
