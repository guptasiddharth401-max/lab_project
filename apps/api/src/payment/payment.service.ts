import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Record a payment for a student against their outstanding fee cycles.
   * - Validate amount is positive
   * - Create payment record
   * - Allocate to oldest outstanding fees
   * - Generate receipt
   * - Maintain ledger integrity
   */
  async recordPayment(
    libraryId: string,
    studentId: string,
    method: 'CASH' | 'UPI',
    amount: number,
    reference: string | null,
    recordedBy: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0.');
    }

    // Validate student exists in this library
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, libraryId },
    });

    if (!student) {
      throw new NotFoundException('Student not found in this library.');
    }

    // Get active admission for fee allocation
    const admission = await this.prisma.admission.findFirst({
      where: {
        studentId,
        libraryId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
    });

    if (!admission) {
      throw new BadRequestException('No active admission found for this student.');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        libraryId,
        studentId,
        admissionId: admission.id,
        amount: new Decimal(amount),
        method,
        reference: reference || null,
        status: 'SUCCESS',
        paidAt: new Date(),
        recordedBy,
      },
    });

    // Allocate payment to oldest outstanding fee cycles
    await this.allocatePayment(studentId, admission.id, amount, payment.id, libraryId);

    // Generate receipt
    const receiptNumber = await this.generateReceiptNumber(libraryId);
    await this.prisma.receipt.create({
      data: {
        libraryId,
        paymentId: payment.id,
        number: receiptNumber,
        amount: new Decimal(amount),
        method,
        issuedAt: new Date(),
        recordedBy,
      },
    });

    return {
      success: true,
      paymentId: payment.id,
      receiptNumber,
      amount,
    };
  }

  /**
   * Allocate payment against the oldest outstanding fee cycles.
   * Updates fee cycle status as fees are paid.
   */
  private async allocatePayment(
    studentId: string,
    admissionId: string,
    amount: number,
    paymentId: string,
    libraryId: string,
  ) {
    const feeCycles = await this.prisma.feeCycle.findMany({
      where: {
        admissionId,
        libraryId,
        status: { in: ['OPEN', 'OVERDUE'] },
      },
      orderBy: { dueDate: 'asc' },
    });

    let remainingAmount = amount;

    for (const cycle of feeCycles) {
      if (remainingAmount <= 0) break;

      const cycleAmount = parseFloat(cycle.charge.toString());
      const allocatedAmount = Math.min(remainingAmount, cycleAmount);

      await this.prisma.paymentAllocation.create({
        data: {
          paymentId,
          feeCycleId: cycle.id,
          admissionId,
          amount: new Decimal(allocatedAmount),
        },
      });

      // Update fee cycle status based on allocation
      const totalAllocated = await this.prisma.paymentAllocation.aggregate({
        where: { feeCycleId: cycle.id },
        _sum: { amount: true },
      });

      const totalAllocatedAmount = parseFloat(totalAllocated._sum.amount?.toString() || '0');
      const newStatus = totalAllocatedAmount >= cycleAmount ? 'PAID' : 'PARTIAL';

      await this.prisma.feeCycle.update({
        where: { id: cycle.id },
        data: { status: newStatus },
      });

      remainingAmount -= allocatedAmount;
    }
  }

  /**
   * Generate unique receipt number per library.
   * Format: RCP-XXXXXX (incrementing)
   */
  private async generateReceiptNumber(libraryId: string): Promise<string> {
    const lastReceipt = await this.prisma.receipt.findFirst({
      where: { libraryId },
      orderBy: { createdAt: 'desc' },
    });

    const lastNumber = lastReceipt ? parseInt(lastReceipt.number.split('-')[1], 10) : 0;
    return `RCP-${String(lastNumber + 1).padStart(6, '0')}`;
  }

  /**
   * Calculate outstanding balance for a student.
   * Returns sum of open + overdue fees minus concessions.
   */
  async getOutstandingBalance(studentId: string, libraryId: string): Promise<number> {
    const fees = await this.prisma.feeCycle.findMany({
      where: {
        admission: { studentId, libraryId },
        status: { in: ['OPEN', 'OVERDUE'] },
      },
    });

    const concessions = await this.prisma.concession.findMany({
      where: {
        feeCycle: { admission: { studentId } },
        libraryId,
      },
    });

    const totalFees = fees.reduce((sum, f) => sum + parseFloat(f.charge.toString()), 0);
    const totalConcessions = concessions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    return Math.max(totalFees - totalConcessions, 0);
  }
}
