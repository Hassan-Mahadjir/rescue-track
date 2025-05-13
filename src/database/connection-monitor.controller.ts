import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ConnectionMonitorService } from './connection-monitor.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { RolesJwtAuthGuard } from 'src/auth/guards/role-jwt/role-jwt.guard';

@Controller('database-monitor')
@UseGuards(RolesJwtAuthGuard)
@Roles(Role.DEVELOPER)
export class ConnectionMonitorController {
  constructor(private readonly monitorService: ConnectionMonitorService) {}

  @Get('metrics')
  getMetrics() {
    return this.monitorService.getMetrics();
  }

  @Get('metrics/:hospitalId')
  getHospitalMetrics(@Param('hospitalId') hospitalId: string) {
    return this.monitorService.getMetrics(hospitalId);
  }

  @Get('utilization')
  getPoolUtilization() {
    return this.monitorService.getPoolUtilization();
  }

  @Get('utilization/:hospitalId')
  getHospitalPoolUtilization(@Param('hospitalId') hospitalId: string) {
    return this.monitorService.getPoolUtilization(hospitalId);
  }
}
