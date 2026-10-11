import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternetAccessResult } from '@library/types';

@Injectable()
export class InternetAccessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if student is allowed internet access.
   * Rules:
   * 1. Must have active membership
   * 2. Must be within shift hours
   * 3. Must not have excessive overdue fees (> 3 days)
   * 4. Device must be registered and active
   * 5. Device limit must not be exceeded (2 devices)
   */
  async checkAccess(
    studentId: string,
    deviceId: string,
    libraryId: string,
  ): Promise<InternetAccessResult> {
    // 1. Check active membership
    const admission = await this.prisma.admission.findFirst({
      where: {
        studentId,
        libraryId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      include: { shift: true },
    });

    if (!admission) {
      return {
        allowed: false,
        reason: 'No active membership found.',
      };
    }

    // 2. Check shift hours
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes < admission.shift.startMinutes || currentMinutes > admission.shift.endMinutes) {
      return {
        allowed: false,
        reason: `Outside shift hours (${this.formatTime(admission.shift.startMinutes)}-${this.formatTime(admission.shift.endMinutes)}).`,
      };
    }

    // 3. Check overdue fees
    const overdueFees = await this.prisma.feeCycle.findFirst({
      where: {
        admissionId: admission.id,
        status: 'OVERDUE',
        dueDate: { lt: new Date() },
      },
    });

    if (overdueFees) {
      const daysOverdue = Math.floor(
        (Date.now() - overdueFees.dueDate.getTime()) / (24 * 60 * 60 * 1000),
      );

      if (daysOverdue >= 3) {
        return {
          allowed: false,
          reason: 'Payment overdue. Please settle outstanding fees to resume internet access.',
          blockedUntil: new Date(overdueFees.dueDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        };
      }
    }

    // 4. Check device authorization
    const device = await this.prisma.studentDevice.findFirst({
      where: { id: deviceId, studentId, status: 'ACTIVE' },
    });

    if (!device) {
      return {
        allowed: false,
        reason: 'Device is not registered, inactive, or blocked.',
      };
    }

    // 5. Check device limit
    const activeDevices = await this.prisma.studentDevice.count({
      where: {
        studentId,
        status: 'ACTIVE',
        internetSessions: {
          some: { status: 'ACTIVE' },
        },
      },
    });

    const deviceLimit = 2;
    if (activeDevices >= deviceLimit) {
      return {
        allowed: false,
        reason: `Device limit reached (${deviceLimit} active sessions). Please disconnect another device.`,
      };
    }

    // All checks passed
    return {
      allowed: true,
      reason: 'All access checks passed.',
    };
  }

  /**
   * Register a new device for a student.
   * Enforces device limit per student (max 2).
   */
  async registerDevice(
    studentId: string,
    libraryId: string,
    type: string,
    name: string,
    credential: string,
  ) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, libraryId },
    });

    if (!student) {
      throw new BadRequestException('Student not found in this library.');
    }

    const deviceCount = await this.prisma.studentDevice.count({
      where: { studentId },
    });

    if (deviceCount >= 2) {
      throw new BadRequestException(
        'Maximum device limit reached (2 devices). Revoke a device before registering a new one.',
      );
    }

    return this.prisma.studentDevice.create({
      data: {
        studentId,
        type: type as any,
        name,
        credential,
        registeredAt: new Date(),
      },
    });
  }

  /**
   * Revoke device access and disconnect active sessions.
   */
  async revokeDevice(deviceId: string, studentId: string) {
    const device = await this.prisma.studentDevice.findFirst({
      where: { id: deviceId, studentId },
    });

    if (!device) {
      throw new BadRequestException('Device not found.');
    }

    // Disconnect active sessions
    await this.prisma.internetSession.updateMany({
      where: {
        deviceId,
        status: 'ACTIVE',
      },
      data: {
        status: 'DISCONNECTED',
        endTime: new Date(),
      },
    });

    return this.prisma.studentDevice.update({
      where: { id: deviceId },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
  }

  /**
   * Block device due to violations.
   */
  async blockDevice(deviceId: string, reason: string) {
    await this.prisma.internetSession.updateMany({
      where: { deviceId, status: 'ACTIVE' },
      data: {
        status: 'BLOCKED',
        reason,
        endTime: new Date(),
      },
    });

    return this.prisma.studentDevice.update({
      where: { id: deviceId },
      data: { status: 'BLOCKED' },
    });
  }

  private formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}
