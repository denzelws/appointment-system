import { SchedulrIcon } from "../../design-system/SchedulrIcon";
import { useAuth } from "../../hooks/useAuth";

const GridIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const navMain = [
  { label: "Dashboard", icon: <GridIcon />, active: true },
  { label: "Calendar", icon: <CalendarIcon />, active: false },
  { label: "Clients", icon: <UsersIcon />, active: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside
      className="fixed top-0 left-0 h-full flex flex-col z-20 transition-all"
      style={{
        width: "240px",
        background: "transparent",
        borderRight: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex items-center gap-3 px-6 py-8">
        {/* CORREÇÃO 1: bg-[#4F6EF7] no lugar de bg-accent */}
        <div className="w-8 h-8 bg-[#4F6EF7] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,110,247,0.4)]">
          <SchedulrIcon size={20} color="#fff" />
        </div>
        <span className="font-display text-xl font-semibold tracking-tight text-white">
          Schedulr
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navMain.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 group ${
              item.active
                ? // CORREÇÃO 2: bg-[#4F6EF7] no lugar de bg-accent no item ativo
                  "bg-[#4F6EF7] text-white shadow-lg shadow-[0_4px_14px_rgba(79,110,247,0.25)]"
                : "text-[#8A9DC0] hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span
              className={
                item.active
                  ? "text-white"
                  : "text-[#6A7E9C] group-hover:text-white transition-colors"
              }
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 mb-2">
        <div className="h-px w-full bg-white/[0.04] mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-white truncate">
              {user?.name || "Administrador"}
            </p>
            <p className="text-[12px] text-[#6A7E9C] truncate">
              {user?.email || "admin@email.com"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[13px] font-medium text-[#6A7E9C] hover:text-[#F87171] transition-colors group"
        >
          <span className="group-hover:text-[#F87171] transition-colors">
            <LogoutIcon />
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
