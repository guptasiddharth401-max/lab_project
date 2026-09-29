import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InternetAccessResult } from '@library/types';

@Injectable()
export class InternetAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAccess(
    studentId: string,
    deviceId: string,
    libraryId: string,
  ): Promise<InternetAccessResult> {
    // 1. Check membership (admission)
    const admission = await this.prisma.admission.findFirst({
      where: {
        studentId,
        libraryId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });

    if (!admission) {
      return {
        allowed: false,
        reason: 'Membership not active or expired',
      };
    }

    // 2. Check current shift
    const shift = await this.prisma.shift.findUnique({
      where: { id: admission.shiftId },
    });

    const now = new Date();
    const currentMinutes =
      now.getHours() * 60 + now.getMinutes() + now.getTimezoneOffset();

    if (currentMinutes < shift.startMinutes || currentMinutes > shift.endMinutes) {
      return {
        allowed: false,
        reason: 'Outside shift hours',
      };
    }

    // 3. Check payment status
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
          reason: 'Payment overdue. Please settle dues.',
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
        reason: 'Device not registered or blocked',
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

    const deviceLimit = 2; // From settings

    if (activeDevices >= deviceLimit) {
      return {
        allowed: false,
        reason: 'Device limit reached',
      };
    }

    // Access granted
    return {
      allowed: true,
      reason: 'All checks passed',
    };
  }

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
      throw new Error('Student not found');
    }

    const deviceCount = await this.prisma.studentDevice.count({
      where: { studentId },
    });

    if (deviceCount >= 2) {
      throw new Error('Maximum device limit reached');
    }

    return this.prisma.studentDevice.create({
      data: {
        studentId,
        libraryId,
        type: type as any,
        name,
        credential,
        registeredAt: new Date(),
      },
    });
  }

  async revokeDevice(deviceId: string, studentId: string) {
    const device = await this.prisma.studentDevice.findFirst({
      where: { id: deviceId, studentId },
    });

    if (!device) {
      throw new Error('Device not found');
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
}
