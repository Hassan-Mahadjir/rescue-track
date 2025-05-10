import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Profile } from 'src/entities/main/profile.entity';
import { Owner } from 'src/entities/main/owner.entity';
import { User } from 'src/entities/main/user.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import { MailModule } from 'src/mail/mail.module';
import { Hospital } from 'src/entities/main/hospital.entity';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseConnectionService } from 'src/database/database.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Owner, User, Hospital], 'primary'),
    MailModule,
    DatabaseModule,
  ],

  controllers: [ProfileController],
  providers: [
    ProfileService,
    UserService,
    AdministratorService,
    DatabaseConnectionService,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
