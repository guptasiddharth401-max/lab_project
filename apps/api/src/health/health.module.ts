import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [HealthService, PrismaService],
  exports: [HealthService],
})
export class HealthModule {}
