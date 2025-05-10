import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PatientModule } from './patient/patient.module';
import { PatientCareReportModule } from './patient-care-report/patient-care-report.module';
import { RunReportModule } from './run-report/run-report.module';
import { AdministratorModule } from './administrator/administrator.module';
import { HospitalContextMiddleware } from './config/hospital-context.middleware';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig.primary, dbConfig.secondary, dbConfigProduction],
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // Primary database connection for hospital and user management
    TypeOrmModule.forRootAsync({
      name: 'primary',
      useFactory:
        process.env.NODE_ENV === 'production'
          ? dbConfigProduction
          : dbConfig.primary,
    }),
    // Secondary database connection for tenant-specific data
    TypeOrmModule.forRootAsync({
      name: 'secondary',
      useFactory:
        process.env.NODE_ENV === 'production'
          ? dbConfigProduction
          : dbConfig.secondary,
    }),
    UserModule,
    AuthModule,
    MailModule,
    ProfileModule,
    PatientModule,
    PatientCareReportModule,
    RunReportModule,
    AdministratorModule,
    DatabaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HospitalContextMiddleware)
      .exclude(
        'administrator/(.*)', // Exclude all administrator routes
        'auth/signup',
        'auth/login',
        'auth/google/login',
        'auth/google/callback',
        'auth/microsoft/login',
        'auth/microsoft/callback',
        'auth/send-verification-email',
        'auth/forget-password',
        'auth/validate-otpCode',
        'auth/refresh', // Exclude refresh token route
        'auth/admin/refresh', // Exclude admin refresh token route
      )
      .forRoutes('*');
  }
}
