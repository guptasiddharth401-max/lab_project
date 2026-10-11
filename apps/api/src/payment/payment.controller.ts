import { Body, Controller, Get, Param, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryId } from '../common/decorators/library-id.decorator';
import { RecordPaymentDto } from '@library/validation';
import { AuthUser } from '@library/types';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly auditService: AuditService,
  ) {}

  @Post('record')
  async recordPayment(
    @Body() dto: RecordPaymentDto,
    @LibraryId() libraryId: string,
    @CurrentUser() user: AuthUser,
  ) {
    if (!dto.studentId || !dto.method || !dto.amount) {
      throw new BadRequestException('Student ID, payment method, and amount are required.');
    }

    const result = await this.paymentService.recordPayment(
      libraryId,
      dto.studentId,
      dto.method as 'CASH' | 'UPI',
      parseFloat(dto.amount),
      dto.reference,
      user.id,
    );

    await this.auditService.log(
      libraryId,
      user.id,
      'PAYMENT_RECORDED',
      'PAYMENT',
      result.paymentId,
      'SUCCESS',
      { amount: dto.amount, method: dto.method, studentId: dto.studentId },
    );

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('outstanding/:studentId')
  async getOutstandingBalance(
    @Param('studentId') studentId: string,
    @LibraryId() libraryId: string,
  ) {
    const balance = await this.paymentService.getOutstandingBalance(studentId, libraryId);
    return {
      success: true,
      data: { studentId, outstandingBalance: balance },
      timestamp: new Date().toISOString(),
    };
  }
}
