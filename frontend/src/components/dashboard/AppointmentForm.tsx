import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createAppointmentSchema,
  type CreateAppointmentInput,
} from "../../schemas";
import { type Appointment } from "../../types";
import { buildSlotISO } from "../../utils/formatters";

const SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

interface AppointmentFormProps {
  selectedDate: Date | undefined;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  onCreate: (isoDate: string, notes?: string) => Promise<Appointment | null>;
  loading: boolean;
  error: string | null;
}

export function AppointmentForm({
  selectedDate,
  selectedSlot,
  onSelectSlot,
  onCreate,
  loading,
  error,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
  });

  useEffect(() => {
    if (selectedDate) {
      setValue("start_time", buildSlotISO(selectedDate, selectedSlot), {
        shouldValidate: false,
      });
    }
  }, [selectedDate, selectedSlot, setValue]);

  const onSubmit = async (data: CreateAppointmentInput) => {
    if (!selectedDate) return;
    const apt = await onCreate(data.start_time, data.notes);
    if (apt) reset();
  };

  return (
    <>
      {/* Slots */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#6A7E9C] tracking-wider mb-3 uppercase">
          Available Slots
        </p>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
                selectedSlot === slot
                  ? "bg-[#4F6EF7] border-[#4F6EF7] text-white shadow-[0_0_15px_rgba(79,110,247,0.4)]"
                  : "bg-transparent border-white/[0.08] text-[#8A9DC0] hover:border-white/[0.2]"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("start_time")} />

        <div>
          <textarea
            {...register("notes")}
            rows={2}
            maxLength={500}
            placeholder="Notes (optional)..."
            className="w-full resize-none text-[13px] rounded-[10px] px-3 py-2.5 transition-colors"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#C8D4F0",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(79,110,247,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.07)")
            }
          />
          {errors.notes && (
            <p className="mt-1 text-[11px]" style={{ color: "#F87171" }}>
              {errors.notes.message}
            </p>
          )}
        </div>

        {errors.start_time && (
          <p className="text-[11px]" style={{ color: "#F87171" }}>
            {errors.start_time.message}
          </p>
        )}

        {error && (
          <p
            className="text-[12px] px-3 py-2 rounded-lg"
            style={{ background: "rgba(239,68,68,0.08)", color: "#F87171" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || loading || !selectedDate}
          className="w-full text-white font-medium text-[14px] py-3.5 rounded-xl transition-all"
          style={{
            background:
              isSubmitting || loading ? "rgba(79,110,247,0.5)" : "#4F6EF7",
            boxShadow:
              isSubmitting || loading
                ? "none"
                : "0 8px 20px -6px rgba(79,110,247,0.5)",
            cursor:
              isSubmitting || loading || !selectedDate
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isSubmitting || loading ? "Creating..." : "Confirm Appointment"}
        </button>
      </form>
    </>
  );
}
