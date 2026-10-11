import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, AuditService],
  exports: [PaymentService],
})
export class PaymentModule {}
