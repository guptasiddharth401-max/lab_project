import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudentPortalService } from './student-portal.service';

@Controller('student-portal')
export class StudentPortalController {
  constructor(private readonly service: StudentPortalService) {}

  @Get('profile/:studentId')
  async getProfile(
    @Param('studentId') studentId: string,
    @Query('libraryId') libraryId: string,
  ) {
    return this.service.getStudentProfile(studentId, libraryId);
  }
}
