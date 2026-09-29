import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  providers: [PaymentService, PrismaService, AuditService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
