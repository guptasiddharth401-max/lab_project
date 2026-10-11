import { describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { StudentsService } from './students.service';

describe('StudentsService', () => {
  it('requires a valid libraryId before listing', async () => {
    const prisma = { student: { findMany: jest.fn() } } as any;
    const service = new StudentsService(prisma);

    await expect(service.listByLibrary('')).rejects.toThrow(BadRequestException);
  });

  it('prevents duplicate student codes within a library', async () => {
    const prisma = {
      student: {
        findFirst: jest.fn().mockResolvedValue({ id: 's1' }),
        create: jest.fn(),
      },
    } as any;

    const service = new StudentsService(prisma);

    await expect(
      service.create('lib-1', {
        code: 'L1',
        name: 'Rahul',
        mobile: '9999999999',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });
});
