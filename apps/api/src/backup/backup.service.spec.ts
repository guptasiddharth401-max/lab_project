import { describe, expect, it, jest } from '@jest/globals';
import { BackupService } from './backup.service';

describe('BackupService', () => {
  it('creates a backup snapshot for audit logs', async () => {
    const prisma = {
      auditLog: {
        findMany: jest.fn().mockResolvedValue([{ id: 'a1', action: 'LOGIN' }]),
      },
    } as any;

    const service = new BackupService(prisma);
    const result = await service.createBackup('lib-1');

    expect(result.success).toBe(true);
    expect(result.data.recordCount).toBe(1);
    expect(result.data.backupId).toContain('backup-');
  });
});
