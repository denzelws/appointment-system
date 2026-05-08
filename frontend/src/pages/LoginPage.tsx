import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { SchedulrIcon } from "../design-system/SchedulrIcon";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginInput } from "../schemas";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
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
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const ok = await login(data.email, data.password);
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
          className="text-lg font-semibold tracking-tight font-display"
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
          className="font-display text-[26px] font-bold mb-1"
          style={{ color: "#EEF2FF", letterSpacing: "-0.03em" }}
        >
          Welcome back
        </h1>
        <p className="text-sm mb-7" style={{ color: "#5A6A8A" }}>
          Enter your credentials to access your dashboard
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
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: "#4A5A7A" }}
              >
                Password
              </label>
              <span
                className="text-xs cursor-pointer transition-colors"
                style={{ color: "#4F6EF7" }}
              >
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#3A4A6A" }}
              >
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#C8D4F0",
                  borderRadius: "10px",
                  padding: "10px 40px 10px 38px",
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#3A4A6A" }}
              >
                <EyeIcon open={showPassword} />
              </button>
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
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: "#2A3A5A" }}
          >
            Or continue with
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <GoogleIcon />, label: "Google" },
            { icon: <GithubIcon />, label: "GitHub" },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              className="flex items-center justify-center gap-2 text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                padding: "10px",
                color: "#7A8AAA",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.07)";
              }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm relative z-10" style={{ color: "#3A4A6A" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium transition-colors"
          style={{ color: "#4F6EF7" }}
        >
          Request access
        </Link>
      </p>
    </div>
  );
}
