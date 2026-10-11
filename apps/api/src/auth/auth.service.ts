import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser, UserRole } from '@library/types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateLogin(email: string, password: string): Promise<AuthUser | null> {
    if (!email || !password) {
      return null;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.active) {
      return null;
    }

    const passwordValid = user.password === password;
    if (!passwordValid) {
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
      throw new BadRequestException('Invalid credentials');
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
