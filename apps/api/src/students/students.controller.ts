import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDTO } from '@library/types';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryId } from '../common/decorators/library-id.decorator';

@Controller('students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async list(@LibraryId() libraryId: string, @CurrentUser() user: any) {
    return this.studentsService.listByLibrary(libraryId);
  }

  @Get(':id')
  async get(@Param('id') id: string, @LibraryId() libraryId: string) {
    return this.studentsService.findById(id, libraryId);
  }

  @Post()
  async create(@Body() dto: StudentDTO, @LibraryId() libraryId: string) {
    return this.studentsService.create(libraryId, dto);
  }
}
