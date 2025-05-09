import { Module } from '@nestjs/common';
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
    TypeOrmModule.forRootAsync({
      name: 'primary',
      useFactory:
        process.env.NODE_ENV === 'production'
          ? dbConfigProduction
          : dbConfig.primary,
    }),
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
  ],
})
export class AppModule {}
