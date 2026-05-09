import { useEffect, useState } from "react";

import { AppointmentCalendar } from "../components/dashboard/AppointmentCalendar";
import { AppointmentForm } from "../components/dashboard/AppointmentForm";
import { TimelineRow } from "../components/dashboard/TimelineRow";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { Sidebar } from "../components/layout/Sidebar";

import { useAppointment } from "../hooks/useAppointment";
import { useAuth } from "../hooks/useAuth";

import { type Appointment } from "../types";

export function DashboardPage() {
  const { user } = useAuth();
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    create,
    cancel,
    confirmAppointment,
  } = useAppointment();

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedSlot, setSelectedSlot] = useState("09:00 AM");

  const todayLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreate = async (isoDate: string, notes?: string) => {
    return await create(isoDate, notes);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) return;
    await cancel(id);
  };

  const handleConfirm = async (id: string) => {
    if (!window.confirm("Confirm this appointment?")) return;
    await confirmAppointment(id);
  };

  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const pending = appointments.filter((a) => a.status === "PENDING").length;

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ backgroundColor: "#090C15" }}
    >
      <div
        className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none opacity-30 mix-blend-screen z-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(79,110,247,1) 0%, rgba(139,92,246,1) 100%)",
        }}
      />
      <div
        className="absolute -bottom-[10%] -left-[5%] w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none opacity-20 mix-blend-screen z-0"
        style={{
          background:
            "linear-gradient(270deg, rgba(79,110,247,1) 0%, rgba(139,92,246,1) 100%)",
        }}
      />

      <Sidebar />
      <DashboardHeader />

      <main
        className="relative z-10 flex-1 flex gap-6 p-8"
        style={{ marginLeft: "240px", marginTop: "80px" }}
      >
        <div className="relative w-full flex gap-6">
          <div className="w-[360px] flex-shrink-0">
            <div className="bg-[#131929]/90 backdrop-blur-2xl border border-white/[0.04] rounded-2xl p-6 shadow-2xl">
              <AppointmentCalendar
                selected={selectedDate}
                onSelect={setSelectedDate}
              />

              <AppointmentForm
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                onCreate={handleCreate}
                loading={loading}
                error={error}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-[#131929]/90 backdrop-blur-2xl border border-white/[0.04] rounded-2xl flex-1 flex flex-col shadow-2xl overflow-hidden">
              <div className="px-8 pt-8 pb-6 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-white tracking-tight mb-1">
                    Operational Timeline
                  </h2>
                  <p className="text-[14px] text-[#6A7E9C]">{todayLabel}</p>
                </div>
                {user?.role === "ADMIN" && (
                  <span
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(79,110,247,0.1)",
                      border: "1px solid rgba(79,110,247,0.2)",
                      color: "#8CA4FF",
                    }}
                  >
                    Admin Workspace
                  </span>
                )}
              </div>

              <div className="h-px w-full bg-white/[0.04]" />

              <div className="flex-1 p-2 overflow-y-auto">
                {loading && appointments.length === 0 && (
                  <p className="text-[13px] text-[#6A7E9C] text-center py-12">
                    Loading...
                  </p>
                )}
                {!loading && appointments.length === 0 && (
                  <p className="text-[13px] text-[#6A7E9C] text-center py-12">
                    No appointments scheduled.
                  </p>
                )}
                <div className="flex flex-col">
                  {appointments.map((apt: Appointment) => (
                    <TimelineRow
                      key={apt.id}
                      apt={apt}
                      userRole={user?.role || "USER"}
                      currentUserId={user?.id || ""}
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              </div>

              {appointments.length > 0 && (
                <div className="px-8 py-5 border-t border-white/[0.04] bg-[#111624]/50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                      <span className="text-[13px] text-[#8A9DC0]">
                        {confirmed} Confirmed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                      <span className="text-[13px] text-[#8A9DC0]">
                        {pending} Pending
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
