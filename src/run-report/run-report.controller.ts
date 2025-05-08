import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { RunReportService } from './run-report.service';
import { CreateRunReportDto } from './dto/create-run-report.dto';
import { UpdateRunReportDto } from './dto/update-run-report.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

@Controller('run-report')
export class RunReportController {
  constructor(private readonly runReportService: RunReportService) {}

  @Post()
  create(@Body() createRunReportDto: CreateRunReportDto, @Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.runReportService.create(userId, createRunReportDto);
  }

  @Get('/manage')
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.runReportService.findAll();
  }

  @Get('/manage/:id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.runReportService.findOne(+id);
  }

  @Get(':id')
  getReportLast24Hours(@Param('id') id: string, @Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.runReportService.getReportFromLast24Hours(+id, userId);
  }

  @Get()
  getReportsLast24Hours(@Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.runReportService.getReportsFromLast24Hours(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRunReportDto: UpdateRunReportDto,
  ) {
    return this.runReportService.update(+id, updateRunReportDto);
  }

  @Delete('/manage/:id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.runReportService.remove(+id);
  }
}
