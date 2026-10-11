import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { LibraryId } from '../common/decorators/library-id.decorator';

@Controller('audit')
@UseGuards(AuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async listAuditLogs(@LibraryId() libraryId: string) {
    const logs = await this.auditService.listLogs(libraryId, 100);
    return {
      success: true,
      data: logs,
      timestamp: new Date().toISOString(),
    };
  }
}
