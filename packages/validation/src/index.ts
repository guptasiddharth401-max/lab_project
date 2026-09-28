import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsPhoneNumber('IN')
  mobile: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  course?: string;
}

export class CreateAdmissionDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  planId: string;

  @IsUUID()
  shiftId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}

export class AssignSeatDto {
  @IsUUID()
  seatId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RecordPaymentDto {
  @IsUUID()
  studentId: string;

  @IsEnum(['CASH', 'UPI'])
  method: 'CASH' | 'UPI';

  @IsString()
  amount: string; // Decimal as string

  @IsString()
  @IsOptional()
  reference?: string;
}

export class RegisterDeviceDto {
  @IsEnum(['PHONE', 'LAPTOP', 'TABLET', 'OTHER'])
  type: string;

  @IsString()
  name: string;

  @IsString()
  credential: string;
}
