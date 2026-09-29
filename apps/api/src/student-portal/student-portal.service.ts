import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentProfile(studentId: string, libraryId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, libraryId },
      include: {
        admissions: {
          where: { status: 'ACTIVE' },
          include: {
            plan: true,
            shift: true,
            seatAssignments: {
              where: { endTime: null },
              include: { seat: true },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const activeAdmission = student.admissions[0];
    const seat = activeAdmission?.seatAssignments[0]?.seat;
    const shift = activeAdmission?.shift;

    return {
      id: student.id,
      name: student.name,
      code: student.code,
      mobile: student.mobile,
      seat: seat?.code,
      shift: this.formatShift(shift),
      membership: {
        status: activeAdmission?.status || 'EXPIRED',
        expiresAt: activeAdmission?.endDate,
      },
      paymentDue: await this.calculateOutstandingBalance(studentId),
      internetStatus: await this.getInternetStatus(studentId, libraryId),
      registeredDevices: await this.getRegisteredDevices(studentId),
    };
  }

  private formatShift(shift: any): string | null {
    if (!shift) return null;
    const start = this.minutesToTime(shift.startMinutes);
    const end = this.minutesToTime(shift.endMinutes);
    return `${start} - ${end}`;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  async calculateOutstandingBalance(studentId: string): Promise<number> {
    const fees = await this.prisma.feeCycle.findMany({
      where: {
        admission: { studentId },
        status: { in: ['OPEN', 'OVERDUE'] },
      },
    });

    const total = fees.reduce((sum, f) => sum + parseFloat(f.charge.toString()), 0);
    return total;
  }

  async getInternetStatus(studentId: string, libraryId: string): Promise<string> {
    const session = await this.prisma.internetSession.findFirst({
      where: {
        studentId,
        libraryId,
        status: 'ACTIVE',
      },
      orderBy: { startTime: 'desc' },
    });

    return session ? 'Active' : 'Inactive';
  }

  async getRegisteredDevices(studentId: string) {
    const devices = await this.prisma.studentDevice.findMany({
      where: { studentId, status: 'ACTIVE' },
      select: { id: true, type: true, name: true },
    });

    return devices;
  }
}
