import { Injectable } from '@nestjs/common';
import { CreateRunReportDto } from './dto/create-run-report.dto';
import { UpdateRunReportDto } from './dto/update-run-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RunReport } from 'src/entities/run-report.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UpdateHistory } from 'src/entities/updateHistory.entity';

@Injectable()
export class RunReportService {
  constructor(
    @InjectRepository(RunReport)
    private RunReportRepository: Repository<RunReport>,
    private userService: UserService,
    @InjectRepository(UpdateHistory)
    private updateHistoryRepository: Repository<UpdateHistory>,
  ) {}

  create(createRunReportDto: CreateRunReportDto) {
    return 'This action adds a new runReport';
  }

  findAll() {
    return `This action returns all runReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} runReport`;
  }

  update(id: number, updateRunReportDto: UpdateRunReportDto) {
    return `This action updates a #${id} runReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} runReport`;
  }
}
