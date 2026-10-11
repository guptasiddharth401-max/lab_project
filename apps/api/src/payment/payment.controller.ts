import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryId } from '../common/decorators/library-id.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RecordPaymentDto } from '@library/validation';
import { AuthUser } from '@library/types';

@Controller('payments')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Record a payment for a student.
   * Restricted to: OWNER, MANAGER, RECEPTIONIST, ACCOUNTANT
   */
  @Post('record')
  @Roles('OWNER', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT')
  @HttpCode(HttpStatus.CREATED)
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

  /**
   * Get outstanding balance for a student.
   * Visible to: OWNER, MANAGER, ACCOUNTANT, STUDENT (own only)
   */
  @Get('outstanding/:studentId')
  @Roles('OWNER', 'MANAGER', 'ACCOUNTANT', 'STUDENT')
  async getOutstandingBalance(
    @Param('studentId') studentId: string,
    @LibraryId() libraryId: string,
    @CurrentUser() user: AuthUser,
  ) {
    // Students can only view their own balance
    if (user.role === 'STUDENT' && user.id !== studentId) {
      throw new BadRequestException('You can only view your own balance.');
    }

    const balance = await this.paymentService.getOutstandingBalance(studentId, libraryId);
    return {
      success: true,
      data: { studentId, outstandingBalance: balance },
      timestamp: new Date().toISOString(),
    };
  }
}
