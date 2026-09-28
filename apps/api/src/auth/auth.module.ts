import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [PrismaService, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
