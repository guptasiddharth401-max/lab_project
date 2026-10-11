import { Controller, Get, Param } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealthStatus() {
    return {
      success: true,
      status: 'healthy',
      service: 'library-saas-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('library/:libraryId')
  async getLibraryHealth(@Param('libraryId') libraryId: string) {
    const health = await this.healthService.calculateLibraryHealth(libraryId);
    return {
      success: true,
      data: health,
      timestamp: new Date().toISOString(),
    };
  }
}
