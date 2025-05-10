import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from 'src/entities/main/owner.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import microsoftOauthConfig from './config/microsoft-oauth.config';
import { MailService } from 'src/mail/mail.service';
import { Profile } from 'src/entities/main/profile.entity';
import { User } from 'src/entities/main/user.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
import { Hospital } from 'src/entities/main/hospital.entity';
import { DatabaseConnectionService } from 'src/database/database.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Owner, Profile, Hospital, User], 'primary'),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(microsoftOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    AdministratorService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
    MicrosoftStrategy,
    MailService,
    DatabaseConnectionService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
