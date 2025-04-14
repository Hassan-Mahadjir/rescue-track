import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RunReportService } from './run-report.service';
import { CreateRunReportDto } from './dto/create-run-report.dto';
import { UpdateRunReportDto } from './dto/update-run-report.dto';

@Controller('run-report')
export class RunReportController {
  constructor(private readonly runReportService: RunReportService) {}

  @Post()
  create(@Body() createRunReportDto: CreateRunReportDto) {
    return this.runReportService.create(createRunReportDto);
  }

  @Get()
  findAll() {
    return this.runReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRunReportDto: UpdateRunReportDto) {
    return this.runReportService.update(+id, updateRunReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runReportService.remove(+id);
  }
}
