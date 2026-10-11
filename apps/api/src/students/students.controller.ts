import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDTO } from '@library/types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LibraryId } from '../common/decorators/library-id.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '@library/types';

@Controller('students')
@UseGuards(AuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * List all students in a library.
   * Restricted to: OWNER, MANAGER, RECEPTIONIST, ACCOUNTANT
   */
  @Get()
  @Roles('OWNER', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT')
  async list(@LibraryId() libraryId: string, @CurrentUser() user: AuthUser) {
    return this.studentsService.listByLibrary(libraryId);
  }

  /**
   * Get a specific student by ID.
   * Restricted to: OWNER, MANAGER, RECEPTIONIST, ACCOUNTANT
   */
  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT')
  async get(@Param('id') id: string, @LibraryId() libraryId: string) {
    return this.studentsService.findById(id, libraryId);
  }

  /**
   * Create a new student.
   * Restricted to: OWNER, MANAGER, RECEPTIONIST
   */
  @Post()
  @Roles('OWNER', 'MANAGER', 'RECEPTIONIST')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: StudentDTO, @LibraryId() libraryId: string) {
    return this.studentsService.create(libraryId, dto);
  }
}
