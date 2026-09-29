import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateLibraryHealth(libraryId: string): Promise<{
    score: number;
    band: string;
    factors: any;
    suggestedActions: string[];
  }> {
    const library = await this.prisma.library.findUnique({
      where: { id: libraryId },
    });

    if (!library) {
      throw new Error('Library not found');
    }

    // Seat utilization (25%)
    const totalSeats = await this.prisma.seat.count({ where: { libraryId } });
    const occupiedSeats = await this.prisma.seatAssignment.count({
      where: {
        libraryId,
        endTime: null,
      },
    });
    const seatUtilization = totalSeats > 0 ? (occupiedSeats / totalSeats) * 100 : 0;
    const seatScore = Math.min(seatUtilization / 100, 1) * 25;

    // Payment health (25%)
    const overdueFees = await this.prisma.feeCycle.count({
      where: {
        libraryId,
        status: 'OVERDUE',
      },
    });
    const totalFeeCycles = await this.prisma.feeCycle.count({
      where: { libraryId },
    });
    const paymentHealth =
      totalFeeCycles > 0 ? ((totalFeeCycles - overdueFees) / totalFeeCycles) * 100 : 100;
    const paymentScore = (paymentHealth / 100) * 25;

    // Membership health (20%)
    const activeAdmissions = await this.prisma.admission.count({
      where: {
        libraryId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });
    const totalAdmissions = await this.prisma.admission.count({
      where: { libraryId },
    });
    const membershipHealth =
      totalAdmissions > 0 ? (activeAdmissions / totalAdmissions) * 100 : 0;
    const membershipScore = (membershipHealth / 100) * 20;

    // Attendance (15%)
    const todayAttendance = await this.prisma.attendance.count({
      where: {
        libraryId,
        date: new Date(),
        status: { in: ['PRESENT', 'LATE'] },
      },
    });
    const expectedAttendance = await this.prisma.student.count({
      where: { libraryId, active: true },
    });
    const attendanceRate =
      expectedAttendance > 0 ? (todayAttendance / expectedAttendance) * 100 : 0;
    const attendanceScore = Math.min(attendanceRate / 100, 1) * 15;

    // Internet health (15%)
    const activeInternetSessions = await this.prisma.internetSession.count({
      where: {
        libraryId,
        status: 'ACTIVE',
      },
    });
    const blockedSessions = await this.prisma.internetSession.count({
      where: {
        libraryId,
        status: 'BLOCKED',
      },
    });
    const internetHealth =
      activeInternetSessions > 0
        ? ((activeInternetSessions - blockedSessions) / activeInternetSessions) * 100
        : 100;
    const internetScore = (internetHealth / 100) * 15;

    const totalScore = seatScore + paymentScore + membershipScore + attendanceScore + internetScore;

    let band = '';
    const suggestedActions: string[] = [];

    if (totalScore >= 90) {
      band = 'Excellent';
    } else if (totalScore >= 75) {
      band = 'Healthy';
    } else if (totalScore >= 60) {
      band = 'Needs Attention';
      suggestedActions.push('Review seat utilization and occupancy rates');
    } else if (totalScore >= 40) {
      band = 'At Risk';
      suggestedActions.push('Contact overdue payment students');
      suggestedActions.push('Review membership renewals');
    } else {
      band = 'Critical';
      suggestedActions.push('Emergency meeting required');
      suggestedActions.push('Address critical payment issues');
    }

    return {
      score: Math.round(totalScore),
      band,
      factors: {
        seatUtilization: Math.round(seatUtilization),
        paymentHealth: Math.round(paymentHealth),
        membershipHealth: Math.round(membershipHealth),
        attendanceRate: Math.round(attendanceRate),
        internetHealth: Math.round(internetHealth),
      },
      suggestedActions,
    };
  }
}
