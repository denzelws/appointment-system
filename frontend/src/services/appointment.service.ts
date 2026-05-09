import type { ApiResponse, Appointment, AppointmentList } from "../types";
import { api } from "./api.client";

export const appointmentService = {
  async create(startTime: string, notes?: string): Promise<Appointment> {
    const { data } = await api.post<ApiResponse<Appointment>>("/appointments", {
      start_time: startTime,
      notes,
    });
    return data.data;
  },

  async list(page = 1, limit = 20): Promise<AppointmentList> {
    const { data } = await api.get<ApiResponse<AppointmentList>>(
      "/appointments",
      {
        params: { page, limit },
      },
    );
    return data.data;
  },

  async cancel(id: string): Promise<Appointment> {
    const { data } = await api.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/cancel`,
    );
    return data.data;
  },

  async confirm(id: string): Promise<Appointment> {
    const { data } = await api.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/confirm`,
    );
    return data.data;
  },
};
