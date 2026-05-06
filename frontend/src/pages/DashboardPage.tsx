import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppointment } from '../hooks/useAppointment';
import { useAuth } from '../hooks/useAuth';
import { createAppointmentSchema, type CreateAppointmentInput, } from '../schemas';
import { type Appointment } from '../types';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { appointments, loading, error, fetchAppointments, create, cancel } =
    useAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onSubmit = async (data: CreateAppointmentInput) => {
    const isoDate = new Date(data.start_time).toISOString();
    const apt = await create(isoDate, data.notes);
    if (apt) reset();
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return;
    await cancel(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Agendamentos</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name}{' '}
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </span>
          <button onClick={logout} className="text-sm text-red-500 hover:underline">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-base font-semibold mb-4">Novo Agendamento</h2>

            {error && (
              <div className="mb-3 p-3 bg-red-50 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  {...register('start_time')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.start_time && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.start_time.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  {...register('notes')}
                  maxLength={500}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Opcional..."
                />
                {errors.notes && (
                  <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting || loading ? 'Criando...' : 'Agendar'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-base font-semibold mb-4">
              {user?.role === 'ADMIN' ? 'Todos os Agendamentos' : 'Meus Agendamentos'}
            </h2>

            {loading && appointments.length === 0 && (
              <p className="text-sm text-gray-500">Carregando...</p>
            )}

            {!loading && appointments.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum agendamento encontrado.</p>
            )}

            <div className="space-y-3">
              {appointments.map((apt: Appointment) => (
                <div
                  key={apt.id}
                  className="border border-gray-100 rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[apt.status]}`}
                      >
                        {STATUS_LABEL[apt.status]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(apt.startTime).toLocaleString('pt-BR')}
                      {' → '}
                      {new Date(apt.endTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {apt.notes && (
                      <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>
                    )}
                  </div>

                  {apt.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="text-xs text-red-500 hover:underline ml-4"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}