import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentDTO } from '@library/types';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByLibrary(libraryId: string) {
    return this.prisma.student.findMany({
      where: { libraryId },
      include: { admissions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, libraryId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, libraryId },
      include: { admissions: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async create(libraryId: string, data: StudentDTO) {
    return this.prisma.student.create({
      data: {
        ...data,
        libraryId,
      },
    });
  }
}
