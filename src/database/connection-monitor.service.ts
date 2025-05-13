import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnectionService } from './database.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ConnectionMonitorService {
  private readonly logger = new Logger(ConnectionMonitorService.name);
  private metrics: Map<
    string,
    {
      totalConnections: number;
      activeConnections: number;
      idleConnections: number;
      waitingRequests: number;
      lastUpdated: Date;
    }
  > = new Map();

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {
    // Start monitoring every 30 seconds
    setInterval(() => this.collectMetrics(), 30000);
  }

  private async collectMetrics() {
    const connections = this.databaseConnectionService['connections'];

    for (const [hospitalId, connection] of connections.entries()) {
      if (connection instanceof DataSource) {
        const pool = (connection as any).driver?.master?._clients;

        if (pool) {
          const metrics = {
            totalConnections: pool.length,
            activeConnections: pool.filter((client: any) => client._active)
              .length,
            idleConnections: pool.filter((client: any) => !client._active)
              .length,
            waitingRequests: (pool as any).waiting,
            lastUpdated: new Date(),
          };

          this.metrics.set(hospitalId, metrics);

          // Log if pool is near capacity
          if (metrics.activeConnections > metrics.totalConnections * 0.8) {
            this.logger.warn(
              `Connection pool for hospital ${hospitalId} is near capacity: ` +
                `${metrics.activeConnections}/${metrics.totalConnections} connections in use`,
            );
          }
        }
      }
    }
  }

  getMetrics(hospitalId?: string) {
    if (hospitalId) {
      return this.metrics.get(hospitalId);
    }
    return Object.fromEntries(this.metrics);
  }

  getPoolUtilization(hospitalId?: string) {
    const metrics = this.getMetrics(hospitalId);
    if (!metrics) return null;

    if (hospitalId) {
      const metric = metrics as any;
      return {
        hospitalId,
        utilization: (metric.activeConnections / metric.totalConnections) * 100,
        activeConnections: metric.activeConnections,
        totalConnections: metric.totalConnections,
        waitingRequests: metric.waitingRequests,
        lastUpdated: metric.lastUpdated,
      };
    }

    return Object.entries(metrics).map(([id, metric]) => ({
      hospitalId: id,
      utilization: (metric.activeConnections / metric.totalConnections) * 100,
      activeConnections: metric.activeConnections,
      totalConnections: metric.totalConnections,
      waitingRequests: metric.waitingRequests,
      lastUpdated: metric.lastUpdated,
    }));
  }
}
