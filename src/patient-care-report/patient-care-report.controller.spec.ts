import { Test, TestingModule } from '@nestjs/testing';
import { PatientCareReportController } from './patient-care-report.controller';
import { PatientCareReportService } from './patient-care-report.service';

describe('PatientCareReportController', () => {
  let controller: PatientCareReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientCareReportController],
      providers: [PatientCareReportService],
    }).compile();

    controller = module.get<PatientCareReportController>(PatientCareReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
