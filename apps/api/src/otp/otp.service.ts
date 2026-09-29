import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  async generateOtp(mobile: string): Promise<{ success: boolean; message: string }> {
    // Rate limiting check
    const recentAttempts = await this.prisma.otpChallenge.findMany({
      where: {
        mobile,
        createdAt: {
          gt: new Date(Date.now() - 1 * 60 * 1000), // Last 1 minute
        },
      },
    });

    if (recentAttempts.length >= 3) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.otpChallenge.create({
      data: {
        mobile,
        otpHash,
        expiresAt,
      },
    });

    // In production: Send via SMS/WhatsApp
    console.log(`[DEV] OTP for ${mobile}: ${otp}`);

    return {
      success: true,
      message: `OTP sent to ${mobile}. Valid for 5 minutes.`,
    };
  }

  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; message?: string }> {
    const otpHash = this.hashOtp(otp);

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        mobile,
        otpHash,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    // Delete used OTP
    await this.prisma.otpChallenge.delete({
      where: { id: challenge.id },
    });

    return { success: true };
  }
}
