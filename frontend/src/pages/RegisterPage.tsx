import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { SchedulrIcon } from "../design-system/SchedulrIcon";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterInput } from "../schemas";

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
    if (ok) navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2.5 mb-8">
        <SchedulrIcon size={36} />
        <span className="text-xl font-semibold text-text-primary tracking-tight">
          Schedulr
        </span>
      </div>

      <div className="w-full max-w-sm bg-bg-surface border border-border-subtle rounded-[14px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Create account
        </h1>
        <p className="text-sm text-text-secondary mb-7">
          Start scheduling with precision
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-[#2E0D0D] border border-[#EF444430] rounded-[8px] text-sm text-[#F87171]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-[#F87171]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className="w-full"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#F87171]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              {...register("password")}
              className="w-full"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-[#F87171]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent-text hover:text-accent transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
