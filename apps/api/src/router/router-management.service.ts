import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class RouterManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async initiateEnrollment(libraryId: string): Promise<{ enrollmentToken: string; qrCode: string }> {
    const router = await this.prisma.router.findFirst({
      where: { libraryId },
    });

    if (!router) {
      throw new NotFoundException('Router not found for library');
    }

    const token = randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.prisma.routerEnrollmentToken.create({
      data: {
        routerId: router.id,
        token,
        expiresAt,
      },
    });

    // Generate QR code content
    const qrContent = JSON.stringify({
      routerId: router.id,
      token,
      endpoint: 'https://api.library-saas.com/api/v1/router/enroll',
    });

    return {
      enrollmentToken: token,
      qrCode: Buffer.from(qrContent).toString('base64'),
    };
  }

  async enrollRouter(enrollmentToken: string, macAddress: string): Promise<{ success: boolean; message: string }> {
    const tokenRecord = await this.prisma.routerEnrollmentToken.findFirst({
      where: {
        token: enrollmentToken,
        expiresAt: { gt: new Date() },
      },
      include: { router: true },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired enrollment token');
    }

    await this.prisma.router.update({
      where: { id: tokenRecord.router.id },
      data: {
        macAddress,
        status: 'ONLINE',
      },
    });

    // Mark token as used
    await this.prisma.routerEnrollmentToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    });

    return {
      success: true,
      message: 'Router enrolled successfully',
    };
  }

  async sendCommand(
    routerId: string,
    command: string,
    payload?: any,
  ): Promise<{ commandId: string; status: string }> {
    const allowedCommands = [
      'HEALTH_CHECK',
      'GET_STATUS',
      'CONFIGURE_CAPTIVE_PORTAL',
      'UPDATE_CONFIG',
      'DISCONNECT_USER',
      'BLOCK_CLIENT',
      'UNBLOCK_CLIENT',
      'RESTART_OPENNDS',
    ];

    if (!allowedCommands.includes(command)) {
      throw new BadRequestException(`Command '${command}' is not allowed`);
    }

    const router = await this.prisma.router.findUnique({
      where: { id: routerId },
    });

    if (!router) {
      throw new NotFoundException('Router not found');
    }

    const cmd = await this.prisma.routerCommand.create({
      data: {
        routerId,
        command,
        payload: payload ? JSON.stringify(payload) : null,
        status: 'PENDING',
      },
    });

    // In production: Send to router via WebSocket/gRPC
    console.log(`[Router Command] ${command} -> ${routerId}`);

    return {
      commandId: cmd.id,
      status: 'PENDING',
    };
  }

  async getRouterStatus(routerId: string) {
    const router = await this.prisma.router.findUnique({
      where: { id: routerId },
      include: {
        events: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        commands: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!router) {
      throw new NotFoundException('Router not found');
    }

    return {
      id: router.id,
      name: router.name,
      model: router.model,
      status: router.status,
      lastSeen: router.lastSeen,
      macAddress: router.macAddress,
      recentEvents: router.events,
      recentCommands: router.commands,
    };
  }

  async recordEvent(routerId: string, event: string, details?: any) {
    return this.prisma.routerEvent.create({
      data: {
        routerId,
        event,
        details: details ? JSON.stringify(details) : null,
      },
    });
  }
}
