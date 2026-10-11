import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuditService, PrismaService],
  exports: [AuditService],
  controllers: [AuditController],
})
export class AuditModule {}
