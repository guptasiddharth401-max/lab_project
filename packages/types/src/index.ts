// User & Auth
export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  ACCOUNTANT = 'ACCOUNTANT',
  STUDENT = 'STUDENT',
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  libraryId: string;
}

export interface AuthPayload {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

// Student
export enum AdmissionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface StudentDTO {
  code: string;
  name: string;
  mobile: string;
  email?: string;
  course?: string;
}

export interface AdmissionDTO {
  studentId: string;
  planId: string;
  shiftId: string;
  startDate: Date;
  endDate: Date;
}

// Seat
export interface SeatDTO {
  code: string;
  sectionId: string;
}

export interface SeatAssignmentDTO {
  studentId: string;
  admissionId: string;
  seatId: string;
  reason?: string;
}

// Payment
export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export interface PaymentDTO {
  studentId: string;
  admissionId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

// Internet
export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  REVOKED = 'REVOKED',
}

export interface DeviceRegistrationDTO {
  type: 'PHONE' | 'LAPTOP' | 'TABLET' | 'OTHER';
  name: string;
  credential: string;
}

export interface InternetAccessCheckDTO {
  studentId: string;
  deviceId: string;
  routerId: string;
}

export interface InternetAccessResult {
  allowed: boolean;
  reason: string;
  blockedUntil?: Date;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
