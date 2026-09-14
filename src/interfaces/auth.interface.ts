import { UserRole } from '@prisma/client';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  email: string;
  fullName: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface UserSummaryDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponseDTO {
  accessToken: string;
  user: UserSummaryDTO;
}

export interface JwtTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  roomId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  roomId?: string;
}

export interface ErrorResponseDTO {
  message: string;
  details?: Record<string, string[]>;
}
