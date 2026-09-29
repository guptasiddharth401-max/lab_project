import { Module } from '@nestjs/common';
import { RouterManagementService } from './router-management.service';
import { RouterManagementController } from './router-management.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RouterManagementService, PrismaService],
  controllers: [RouterManagementController],
  exports: [RouterManagementService],
})
export class RouterManagementModule {}
