import { describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('rejects missing email or password', async () => {
    const prisma = {
      user: { findUnique: jest.fn() },
    } as any;

    const service = new AuthService(prisma);
    await expect(service.validateLogin('', 'pass')).resolves.toBeNull();
    await expect(service.validateLogin('user@example.com', '')).resolves.toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('accepts a valid user login', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'u1',
          email: 'owner@library.com',
          name: 'Owner',
          role: 'OWNER',
          libraryId: 'lib-1',
          active: true,
          password: 'owner@123',
        }),
      },
    } as any;

    const service = new AuthService(prisma);
    await expect(service.validateLogin('owner@library.com', 'owner@123')).resolves.toMatchObject({
      id: 'u1',
      role: 'OWNER',
      libraryId: 'lib-1',
    });
  });
});
