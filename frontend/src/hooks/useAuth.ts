import { useState } from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password);

      const { user } = await authService.login(email, password);
      setUser(user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao cadastrar.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
}
