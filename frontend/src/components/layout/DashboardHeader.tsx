import { useAuth } from "../../hooks/useAuth";

const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BellIcon = () => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between px-8 transition-all"
      style={{
        left: "240px",
        height: "80px",
        // O Truque: Cor do fundo (#090C15 convertida em RGBA) + 80% de opacidade + Blur
        background: "rgba(9, 12, 21, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid transparent", // Sem borda visível para não quebrar a fluidez
      }}
    >
      <div className="w-[400px]">
        {/* Input de busca levemente translúcido */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.04] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/[0.08] transition-all cursor-text group">
          <span className="text-[#6A7E9C] group-hover:text-[#8A9DC0] transition-colors">
            <SearchIcon />
          </span>
          <span className="text-[13px] flex-1 text-[#6A7E9C] group-hover:text-[#8A9DC0] transition-colors">
            Search appointments, clients...
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-[#6A7E9C] hover:text-white transition-colors">
          <BellIcon />
          {/* Pontinho de notificação com a cor da marca */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4F6EF7] shadow-[0_0_8px_rgba(79,110,247,0.6)]" />
        </button>

        <div className="h-6 w-px bg-white/[0.06]" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[13px] font-semibold text-white">
              {user?.role === "ADMIN" ? "Admin Workspace" : "Pro Plan"}
            </p>
            <p className="text-[11px] text-[#6A7E9C]">
              {user?.name || "Administrador"}
            </p>
          </div>
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
            className="w-10 h-10 rounded-full border border-white/[0.08]"
          />
        </div>
      </div>
    </header>
  );
}
