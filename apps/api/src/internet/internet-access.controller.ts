import { Body, Controller, Post, Param, Query } from '@nestjs/common';
import { InternetAccessService } from './internet-access.service';

class CheckAccessDto {
  studentId: string;
  deviceId: string;
}

class RegisterDeviceDto {
  type: string;
  name: string;
  credential: string;
}

@Controller('internet')
export class InternetAccessController {
  constructor(private readonly service: InternetAccessService) {}

  @Post('check-access')
  async checkAccess(
    @Body() dto: CheckAccessDto,
    @Query('libraryId') libraryId: string,
  ) {
    return this.service.checkAccess(dto.studentId, dto.deviceId, libraryId);
  }

  @Post('register-device')
  async registerDevice(
    @Body() dto: RegisterDeviceDto,
    @Query('studentId') studentId: string,
    @Query('libraryId') libraryId: string,
  ) {
    return this.service.registerDevice(
      studentId,
      libraryId,
      dto.type,
      dto.name,
      dto.credential,
    );
  }

  @Post('revoke-device/:deviceId')
  async revokeDevice(
    @Param('deviceId') deviceId: string,
    @Query('studentId') studentId: string,
  ) {
    return this.service.revokeDevice(deviceId, studentId);
  }
}
