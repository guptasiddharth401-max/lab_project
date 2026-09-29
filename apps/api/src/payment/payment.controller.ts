import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

class RecordPaymentDto {
  studentId: string;
  admissionId: string;
  amount: string;
  method: 'CASH' | 'UPI';
  reference?: string;
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('record')
  async recordPayment(
    @Body() dto: RecordPaymentDto,
    @Query('libraryId') libraryId: string,
    @Query('recordedBy') recordedBy: string,
  ) {
    return this.service.recordPayment(
      libraryId,
      dto.studentId,
      dto.admissionId,
      dto.amount,
      dto.method,
      dto.reference || '',
      recordedBy,
    );
  }

  @Get('outstanding-balance/:studentId')
  async getOutstandingBalance(@Query('studentId') studentId: string) {
    const balance = await this.service.getOutstandingBalance(studentId);
    return { studentId, outstandingBalance: balance };
  }
}
