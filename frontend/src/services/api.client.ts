import axios, { AxiosError } from "axios";

const FALLBACK_API_URL = "http://localhost:3000/api/v1";

const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!configuredApiUrl && import.meta.env.PROD) {
  console.warn(
    "[api.client] VITE_API_URL is not set in this production build; falling back to " +
      `${FALLBACK_API_URL}. Set VITE_API_URL at build time to point at the published API.`,
  );
}

const BASE_URL = configuredApiUrl || FALLBACK_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string; code: string }>) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
