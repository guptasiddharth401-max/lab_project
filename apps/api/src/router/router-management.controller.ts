import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { RouterManagementService } from './router-management.service';

class EnrollRouterDto {
  enrollmentToken: string;
  macAddress: string;
}

class SendCommandDto {
  command: string;
  payload?: any;
}

@Controller('router')
export class RouterManagementController {
  constructor(private readonly service: RouterManagementService) {}

  @Post('initiate-enrollment')
  async initiateEnrollment(@Query('libraryId') libraryId: string) {
    return this.service.initiateEnrollment(libraryId);
  }

  @Post('enroll')
  async enrollRouter(@Body() dto: EnrollRouterDto) {
    return this.service.enrollRouter(dto.enrollmentToken, dto.macAddress);
  }

  @Post('command/:routerId')
  async sendCommand(
    @Param('routerId') routerId: string,
    @Body() dto: SendCommandDto,
  ) {
    return this.service.sendCommand(routerId, dto.command, dto.payload);
  }

  @Get('status/:routerId')
  async getStatus(@Param('routerId') routerId: string) {
    return this.service.getRouterStatus(routerId);
  }
}
