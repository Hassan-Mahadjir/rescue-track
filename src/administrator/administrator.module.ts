import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from 'src/entities/main/owner.entity';
import { Profile as OwnerProfile } from 'src/entities/main/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { MailModule } from 'src/mail/mail.module';
import { Database } from 'src/entities/main/database.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Owner, OwnerProfile, Database], 'primary'),
    ProfileModule,
    MailModule,
  ],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdministratorModule {}
