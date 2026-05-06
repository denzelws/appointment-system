export type UserRole = 'USER' | 'ADMIN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AppointmentList {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}