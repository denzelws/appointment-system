import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { SchedulrIcon } from "../design-system/SchedulrIcon";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterInput } from "../schemas";

const UserIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function RegisterPage() {
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const ok = await registerUser(data.name, data.email, data.password);
    if (ok) navigate("/dashboard");
  };

  return (
    <div
      className="grain min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, #0d1530 0%, #080c18 40%, #050816 100%)",
      }}
    >
      <div
        className="glow-1 pointer-events-none absolute"
        style={{
          top: "-200px",
          right: "-200px",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,110,247,0.20) 0%, rgba(79,110,247,0.07) 45%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      <div
        className="glow-2 pointer-events-none absolute"
        style={{
          bottom: "-180px",
          left: "-180px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,80,40,0.12) 0%, rgba(180,60,20,0.05) 50%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      <div
        className="breathe pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(79,110,247,1) 0%, transparent 65%)",
        }}
      />

      <div className="flex items-center gap-2.5 mb-8 relative z-10">
        <SchedulrIcon size={32} />
        <span
          className="font-display text-lg font-semibold tracking-tight"
          style={{ color: "#E8EEFF" }}
        >
          Schedulr
        </span>
      </div>

      <div
        className="relative z-10 w-full max-w-[420px] rounded-2xl p-8"
        style={{
          background: "rgba(16, 22, 40, 0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 0 1px rgba(79,110,247,0.08), 0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h1
          className="font-display text-[26px] font-bold mb-1 tracking-tight"
          style={{ color: "#EEF2FF", letterSpacing: "-0.03em" }}
        >
          Create account
        </h1>
        <p className="text-sm mb-7" style={{ color: "#5A6A8A" }}>
          Start scheduling with precision
        </p>

        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#F87171",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
              style={{ color: "#4A5A7A" }}
            >
              Full Name
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#3A4A6A" }}
              >
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C8D4F0",
                  borderRadius: "10px",
                  padding: "10px 14px 10px 38px",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,110,247,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs" style={{ color: "#F87171" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
              style={{ color: "#4A5A7A" }}
            >
              Email Address
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#3A4A6A" }}
              >
                <MailIcon />
              </span>
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C8D4F0",
                  borderRadius: "10px",
                  padding: "10px 14px 10px 38px",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,110,247,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs" style={{ color: "#F87171" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
              style={{ color: "#4A5A7A" }}
            >
              Password
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#3A4A6A" }}
              >
                <LockIcon />
              </span>
              <input
                type="password"
                placeholder="Min. 8 characters"
                {...register("password")}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C8D4F0",
                  borderRadius: "10px",
                  padding: "10px 14px 10px 38px",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(79,110,247,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs" style={{ color: "#F87171" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium text-sm"
            style={{
              background: loading ? "rgba(79,110,247,0.5)" : "#4F6EF7",
              color: "#fff",
              borderRadius: "10px",
              padding: "11px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 24px rgba(79,110,247,0.3)",
              transition: "all 0.2s",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 32px rgba(79,110,247,0.5)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#5F7EFF";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 24px rgba(79,110,247,0.3)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#4F6EF7";
              }
            }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm relative z-10" style={{ color: "#3A4A6A" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium transition-colors"
          style={{ color: "#4F6EF7" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
