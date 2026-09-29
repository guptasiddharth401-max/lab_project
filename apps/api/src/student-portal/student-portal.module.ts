import { Module } from '@nestjs/common';
import { StudentPortalService } from './student-portal.service';
import { StudentPortalController } from './student-portal.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StudentPortalService, PrismaService],
  controllers: [StudentPortalController],
})
export class StudentPortalModule {}
