export interface CreateAppointmentDTO {
  startTime: string;
  notes?: string;
}

export interface AppointmentResponseDTO {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListAppointmentsDTO {
  page?: number;
  limit?: number;
}

export interface ListAppointmentsResponseDTO {
  appointments: AppointmentResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
