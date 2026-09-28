import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDTO } from '@library/types';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async list(@Query('libraryId') libraryId: string) {
    return this.studentsService.listByLibrary(libraryId || 'demo-library');
  }

  @Get(':id')
  async get(@Param('id') id: string, @Query('libraryId') libraryId: string) {
    return this.studentsService.findById(id, libraryId || 'demo-library');
  }

  @Post()
  async create(@Body() dto: StudentDTO, @Query('libraryId') libraryId: string) {
    return this.studentsService.create(libraryId || 'demo-library', dto);
  }
}
