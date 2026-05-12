import { useState } from "react";
import { type Appointment } from "../../types";
import {
  formatBusinessDate,
  formatBusinessTime,
} from "../../utils/business-timezone";
import { getInitials } from "../../utils/formatters";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "CONFIRMED",
    class: "text-[#4ADE80] border-[#4ADE80]/20",
  },
  PENDING: { label: "PENDING", class: "text-[#FBBF24] border-[#FBBF24]/30" },
  CANCELLED: {
    label: "CANCELLED",
    class: "text-[#F87171] border-[#F87171]/20",
  },
};

interface TimelineRowProps {
  apt: Appointment;
  userRole: string;
  currentUserId: string;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function TimelineRow({
  apt,
  userRole,
  currentUserId,
  onConfirm,
  onCancel,
}: TimelineRowProps) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG];

  const isAdmin = userRole === "ADMIN";
  const isOwner = apt.userId === currentUserId;

  // Regras de permissão espelhando o backend (RN007 + RN011)
  const canCancel = apt.status !== "CANCELLED" && (isAdmin || isOwner);
  const canConfirm = isAdmin && apt.status === "PENDING";

  const startTime = formatBusinessTime(apt.startTime);
  const initials = getInitials(apt.notes || "User");

  return (
    <div
      className={`flex items-center gap-5 px-6 py-4 rounded-xl transition-colors relative ${
        hovered ? "bg-white/[0.02]" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-[13px] font-medium text-[#8A9DC0] w-16 flex-shrink-0">
        {startTime}
      </span>

      <div className="w-10 h-10 rounded-full bg-[#1C2333] flex items-center justify-center text-[13px] font-semibold text-white flex-shrink-0">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-white truncate">
          {apt.notes || "Appointment"}
        </p>
        <p className="text-[13px] text-[#6A7E9C] mt-0.5">
          {formatBusinessDate(apt.startTime)}• 30m
        </p>
      </div>

      <div className="flex items-center gap-3">
        {hovered && (canCancel || canConfirm) ? (
          <>
            {canConfirm && (
              <button
                onClick={() => onConfirm(apt.id)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  color: "#4ADE80",
                  borderColor: "rgba(74,222,128,0.2)",
                  background: "rgba(74,222,128,0.06)",
                }}
              >
                CONFIRM
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => onCancel(apt.id)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  color: "#F87171",
                  borderColor: "rgba(248,113,113,0.2)",
                  background: "rgba(248,113,113,0.06)",
                }}
              >
                CANCEL
              </button>
            )}
          </>
        ) : (
          <span
            className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${status.class}`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
}
