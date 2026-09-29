import { Module } from '@nestjs/common';
import { InternetAccessService } from './internet-access.service';
import { InternetAccessController } from './internet-access.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [InternetAccessService, PrismaService],
  controllers: [InternetAccessController],
  exports: [InternetAccessService],
})
export class InternetAccessModule {}
