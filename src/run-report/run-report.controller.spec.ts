import { Test, TestingModule } from '@nestjs/testing';
import { RunReportController } from './run-report.controller';
import { RunReportService } from './run-report.service';

describe('RunReportController', () => {
  let controller: RunReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunReportController],
      providers: [RunReportService],
    }).compile();

    controller = module.get<RunReportController>(RunReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
