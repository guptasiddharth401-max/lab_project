import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private readonly prisma: PrismaService) {}

  async createBackup(libraryId: string) {
    const startedAt = new Date();
    const auditLogs = await this.prisma.auditLog.findMany({
      where: { libraryId },
      take: 500,
      orderBy: { createdAt: 'desc' },
    });

    const backup = {
      backupId: `backup-${Date.now()}`,
      libraryId,
      createdAt: startedAt.toISOString(),
      recordCount: auditLogs.length,
      records: auditLogs,
    };

    return {
      success: true,
      data: backup,
      timestamp: new Date().toISOString(),
    };
  }
}
