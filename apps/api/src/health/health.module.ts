import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [HealthService, PrismaService],
  controllers: [HealthController],
  exports: [HealthService],
})
export class HealthModule {}
