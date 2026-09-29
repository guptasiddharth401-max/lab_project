import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

class GenerateOtpDto {
  mobile: string;
}

class VerifyOtpDto {
  mobile: string;
  otp: string;
}

@Controller('auth/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateOtpDto) {
    return this.otpService.generateOtp(dto.mobile);
  }

  @Post('verify')
  async verify(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.mobile, dto.otp);
  }
}
