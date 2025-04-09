import { Test, TestingModule } from '@nestjs/testing';
import { PatientCareReportService } from './patient-care-report.service';

describe('PatientCareReportService', () => {
  let service: PatientCareReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientCareReportService],
    }).compile();

    service = module.get<PatientCareReportService>(PatientCareReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
