import { describe, expect, it, jest } from '@jest/globals';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns warning status when overdue fees exist', async () => {
    const prisma = {
      student: { count: jest.fn().mockResolvedValue(3) },
      admission: { count: jest.fn().mockResolvedValue(2) },
      feeCycle: { count: jest.fn().mockResolvedValue(1) },
      studentDevice: { count: jest.fn().mockResolvedValue(1) },
      auditLog: { count: jest.fn().mockResolvedValue(8) },
      $queryRaw: jest.fn().mockResolvedValue([{ ok: 1 }]),
    } as any;

    const service = new HealthService(prisma);
    const result = await service.calculateLibraryHealth('lib-1');

    expect(result.status).toBe('warning');
    expect(result.metrics.totalStudents).toBe(3);
    expect(result.metrics.overdueFeeCycles).toBe(1);
  });
});
