import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { StudentsModule } from './students/students.module';
import { StudentPortalModule } from './student-portal/student-portal.module';
import { InternetAccessModule } from './internet/internet-access.module';
import { RouterManagementModule } from './router/router-management.module';
import { AuditModule } from './audit/audit.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OtpModule,
    StudentsModule,
    StudentPortalModule,
    InternetAccessModule,
    RouterManagementModule,
    AuditModule,
    PaymentModule,
  ],
})
export class AppModule {}
