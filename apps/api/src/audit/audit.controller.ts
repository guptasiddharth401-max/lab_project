import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { LibraryId } from '../common/decorators/library-id.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('audit')
@UseGuards(AuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * List audit logs for a library.
   * Restricted to: OWNER, MANAGER, ACCOUNTANT
   */
  @Get()
  @Roles('OWNER', 'MANAGER', 'ACCOUNTANT')
  @HttpCode(HttpStatus.OK)
  async listAuditLogs(@LibraryId() libraryId: string) {
    const logs = await this.auditService.listLogs(libraryId, 100);
    return {
      success: true,
      data: logs,
      count: logs.length,
      timestamp: new Date().toISOString(),
    };
  }
}
