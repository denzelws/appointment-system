import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

interface AppointmentCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function AppointmentCalendar({
  selected,
  onSelect,
}: AppointmentCalendarProps) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-lg font-semibold text-white tracking-tight mb-4">
        New Appointment
      </h2>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        weekStartsOn={1}
        disabled={{ before: new Date() }}
        showOutsideDays
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            ),
        }}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          month_caption: "flex items-center justify-between px-1 mb-3",
          caption_label: "text-[12px] font-medium text-[#8A9DC0]",
          nav: "flex items-center gap-1",
          button_previous: [
            "w-6 h-6 flex items-center justify-center rounded-md",
            "text-[#6A7E9C] hover:text-white hover:bg-white/10",
            "transition-all bg-transparent border-0 cursor-pointer",
          ].join(" "),
          button_next: [
            "w-6 h-6 flex items-center justify-center rounded-md",
            "text-[#6A7E9C] hover:text-white hover:bg-white/10",
            "transition-all bg-transparent border-0 cursor-pointer",
          ].join(" "),
          month_grid: "w-full border-collapse",
          weekdays: "grid grid-cols-7 mb-2",
          weekday: "text-[11px] font-semibold text-[#6A7E9C] text-center py-1",
          weeks: "w-full",
          week: "grid grid-cols-7 gap-y-1 mt-1",
          day: "flex items-center justify-center p-0",
          day_button: [
            "w-7 h-7 rounded-[6px] text-[13px] font-medium",
            "flex items-center justify-center",
            "text-white hover:bg-white/10",
            "transition-all bg-transparent border-0 cursor-pointer w-full h-full",
          ].join(" "),
          selected: [
            "!bg-[#4F6EF7] !text-white font-semibold",
            "shadow-[0_0_12px_rgba(79,110,247,0.5)]",
            "hover:!bg-[#3D5CE6] hover:!text-white",
          ].join(" "),
          today: "underline decoration-[#4F6EF7] underline-offset-2",
          outside: "opacity-30",
          disabled: "opacity-20 cursor-not-allowed",
          hidden: "invisible",
        }}
      />
    </div>
  );
}
