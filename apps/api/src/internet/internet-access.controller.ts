import { Body, Controller, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { InternetAccessService } from './internet-access.service';
import { AuditService } from '../audit/audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryId } from '../common/decorators/library-id.decorator';
import { AuthUser } from '@library/types';

class CheckAccessDto {
  studentId: string;
  deviceId: string;
}

@Controller('internet')
@UseGuards(AuthGuard)
export class InternetAccessController {
  constructor(
    private readonly internetService: InternetAccessService,
    private readonly auditService: AuditService,
  ) {}

  @Post('check-access')
  async checkAccess(
    @Body() dto: CheckAccessDto,
    @LibraryId() libraryId: string,
    @CurrentUser() user: AuthUser,
  ) {
    if (!dto.studentId || !dto.deviceId) {
      throw new BadRequestException('Student ID and Device ID are required.');
    }

    const result = await this.internetService.checkAccess(
      dto.studentId,
      dto.deviceId,
      libraryId,
    );

    await this.auditService.log(
      libraryId,
      user.id,
      'INTERNET_ACCESS_CHECK',
      'INTERNET_SESSION',
      dto.studentId,
      result.allowed ? 'SUCCESS' : 'FAILURE',
      { reason: result.reason, deviceId: dto.deviceId },
    );

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
