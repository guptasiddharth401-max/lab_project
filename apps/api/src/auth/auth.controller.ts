import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
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

    const passwordValid = await bcrypt.compare(password, user.password);
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
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        lastSeenAt: new Date(),
      },
    });

    return {
      success: true,
      data: {
        user,
        token,
        expiresIn: 24 * 60 * 60,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async validateSession(token: string): Promise<AuthUser | null> {
    const session = await this.prisma.authSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (session.revokedAt || session.expiresAt <= new Date()) {
      await this.prisma.authSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      return null;
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as UserRole,
      libraryId: session.user.libraryId,
    };
  }

  async logout(token: string) {
    await this.prisma.authSession.updateMany({
      where: {
        token,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
