import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async recordPayment(
    libraryId: string,
    studentId: string,
    admissionId: string,
    amount: string,
    method: 'CASH' | 'UPI',
    reference: string,
    recordedBy: string,
  ) {
    // Validate amount
    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        libraryId,
        studentId,
        admissionId,
        amount: amountNum.toString(),
        method,
        reference,
        status: 'SUCCESS',
        paidAt: new Date(),
        recordedBy,
      },
    });

    // Allocate payment to oldest outstanding fees
    await this.allocatePayment(studentId, admissionId, amountNum, payment.id);

    // Create receipt
    const receiptNumber = await this.generateReceiptNumber(libraryId);
    await this.prisma.receipt.create({
      data: {
        libraryId,
        paymentId: payment.id,
        number: receiptNumber,
        amount: amountNum.toString(),
        method,
        issuedAt: new Date(),
        recordedBy,
      },
    });

    // Audit log
    await this.audit.log(
      libraryId,
      recordedBy,
      'PAYMENT_RECORDED',
      'PAYMENT',
      payment.id,
      'SUCCESS',
      { amount, method, studentId },
    );

    return {
      success: true,
      paymentId: payment.id,
      receiptNumber,
    };
  }

  private async allocatePayment(
    studentId: string,
    admissionId: string,
    amount: number,
    paymentId: string,
  ) {
    const feeCycles = await this.prisma.feeCycle.findMany({
      where: {
        admissionId,
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
          amount: allocatedAmount.toString(),
        },
      });

      // Update fee cycle status
      const totalAllocated = await this.prisma.paymentAllocation.aggregate({
        where: { feeCycleId: cycle.id },
        _sum: { amount: true },
      });

      const newStatus =
        parseFloat(totalAllocated._sum.amount?.toString() || '0') >= cycleAmount
          ? 'PAID'
          : 'PARTIAL';

      await this.prisma.feeCycle.update({
        where: { id: cycle.id },
        data: { status: newStatus },
      });

      remainingAmount -= allocatedAmount;
    }
  }

  private async generateReceiptNumber(libraryId: string): Promise<string> {
    const lastReceipt = await this.prisma.receipt.findFirst({
      where: { libraryId },
      orderBy: { createdAt: 'desc' },
    });

    const lastNumber = lastReceipt
      ? parseInt(lastReceipt.number.split('-')[1])
      : 0;

    return `RCP-${String(lastNumber + 1).padStart(6, '0')}`;
  }

  async getOutstandingBalance(studentId: string): Promise<number> {
    const fees = await this.prisma.feeCycle.findMany({
      where: {
        admission: { studentId },
        status: { in: ['OPEN', 'OVERDUE'] },
      },
    });

    const concessions = await this.prisma.concession.findMany({
      where: {
        feeCycle: { admission: { studentId } },
      },
    });

    const totalFees = fees.reduce((sum, f) => sum + parseFloat(f.charge.toString()), 0);
    const totalConcessions = concessions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    return totalFees - totalConcessions;
  }
}
