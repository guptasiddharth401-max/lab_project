import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser, UserRole } from '@library/types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateLogin(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // For demo seed data, simple comparison is used as the initial auth step.
    // Production should use bcrypt.compare.
    if (user.password !== password) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      libraryId: user.libraryId,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateLogin(email, password);

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    return {
      success: true,
      data: {
        user,
        token: 'demo-token-for-local-development',
        expiresIn: 86400,
      },
    };
  }
}
