import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as TenantUser } from 'src/entities/user.entity';
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
import { Profile as TenantProfile } from 'src/entities/profile.entity';
import { Profile as OwnerProfile } from 'src/entities/main/profile.entity';
import { AdministratorService } from 'src/administrator/administrator.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([TenantUser, TenantProfile], 'secondary'),
    TypeOrmModule.forFeature([Owner, OwnerProfile], 'primary'),
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
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
