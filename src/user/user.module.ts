import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/main/user.entity';
import { Profile } from 'src/entities/main/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { Hospital } from 'src/entities/main/hospital.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Hospital], 'primary'),
    ProfileModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
