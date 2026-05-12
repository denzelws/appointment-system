import { useCallback, useState } from "react";
import { appointmentService } from "../services/appointment.service";
import type { Appointment } from "../types";

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response as
      | { data?: { message?: unknown } }
      | undefined;

    if (typeof response?.data?.message === "string") {
      return response.data.message;
    }
  }

  return fallback;
}

export function useAppointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.list(page);
      setAppointments(result.appointments);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao buscar agendamentos."));
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (startTime: string, notes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await appointmentService.create(startTime, notes);
      await fetchAppointments();
      return appointment;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao criar agendamento."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.cancel(id);
      await fetchAppointments();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao cancelar."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.confirm(id);
      await fetchAppointments();
      return true;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao confirmar."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = useCallback(async (date: string) => {
    try {
      return await appointmentService.getAvailableSlots(date);
    } catch {
      return { available: [], unavailable: [] };
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    totalPages,
    fetchAppointments,
    create,
    cancel,
    confirmAppointment,
    getAvailableSlots,
  };
}
