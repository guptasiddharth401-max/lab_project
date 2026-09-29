import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    libraryId: string,
    actor: string,
    action: string,
    entity: string,
    entityId: string,
    result: 'SUCCESS' | 'FAILURE',
    metadata?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        libraryId,
        actor,
        actorType: 'USER',
        action,
        entity,
        entityId,
        result,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
      },
    });
  }

  async listLogs(libraryId: string, limit: number = 100) {
    return this.prisma.auditLog.findMany({
      where: { libraryId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
