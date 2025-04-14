import { Test, TestingModule } from '@nestjs/testing';
import { RunReportService } from './run-report.service';

describe('RunReportService', () => {
  let service: RunReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunReportService],
    }).compile();

    service = module.get<RunReportService>(RunReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
