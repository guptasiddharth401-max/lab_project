import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentDTO } from '@library/types';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByLibrary(libraryId: string) {
    if (!libraryId) {
      throw new BadRequestException('libraryId is required.');
    }

    return this.prisma.student.findMany({
      where: { libraryId },
      include: { admissions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, libraryId: string) {
    if (!id || !libraryId) {
      throw new BadRequestException('Student id and library context are required.');
    }

    const student = await this.prisma.student.findFirst({
      where: { id, libraryId },
      include: { admissions: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found in this library.');
    }

    return student;
  }

  async create(libraryId: string, data: StudentDTO) {
    if (!libraryId) {
      throw new BadRequestException('libraryId is required.');
    }

    if (!data?.code || !data?.name || !data?.mobile) {
      throw new BadRequestException('Student code, name, and mobile are required.');
    }

    const existing = await this.prisma.student.findFirst({
      where: {
        libraryId,
        OR: [{ code: data.code }, { mobile: data.mobile }],
      },
    });

    if (existing) {
      throw new BadRequestException(
        existing.code === data.code
          ? `Student code ${data.code} already exists in this library.`
          : `Student mobile ${data.mobile} already exists in this library.`,
      );
    }

    return this.prisma.student.create({
      data: {
        code: data.code,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        course: data.course,
        libraryId,
      },
    });
  }
}
