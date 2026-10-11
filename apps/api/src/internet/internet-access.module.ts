import { Module } from '@nestjs/common';
import { InternetAccessController } from './internet-access.controller';
import { InternetAccessService } from './internet-access.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [InternetAccessController],
  providers: [InternetAccessService, PrismaService, AuditService],
  exports: [InternetAccessService],
})
export class InternetAccessModule {}
