import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateLibraryHealth(libraryId: string) {
    const [students, activeAdmissions, overdueFees, activeDevices, auditLogs] = await Promise.all([
      this.prisma.student.count({ where: { libraryId } }),
      this.prisma.admission.count({
        where: {
          libraryId,
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
      }),
      this.prisma.feeCycle.count({
        where: {
          libraryId,
          status: 'OVERDUE',
          dueDate: { lt: new Date() },
        },
      }),
      this.prisma.studentDevice.count({
        where: {
          libraryId,
          status: 'ACTIVE',
        },
      }),
      this.prisma.auditLog.count({ where: { libraryId } }),
    ]);

    const status = overdueFees === 0 && activeAdmissions > 0 ? 'healthy' : 'warning';

    return {
      libraryId,
      status,
      metrics: {
        totalStudents: students,
        activeAdmissions,
        overdueFeeCycles: overdueFees,
        activeDevices,
        auditLogEntries: auditLogs,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async getSystemHealth() {
    const dbCheck = await this.prisma.$queryRaw`SELECT 1 as ok`;
    return {
      status: 'healthy',
      database: dbCheck ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
