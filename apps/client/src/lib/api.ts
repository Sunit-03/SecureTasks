import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
export const api = axios.create({ baseURL: baseUrl, withCredentials: true });

// Separate instance for the refresh call itself — must not carry the request
// interceptor's (stale) Authorization header or go through the response
// interceptor below, or a failed refresh would recurse into itself.
const refreshClient = axios.create({ baseURL: baseUrl, withCredentials: true });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then(({ data }) => {
        useAuthStore.getState().setAuth(data.user, data.accessToken);
        return data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retried) {
      throw error;
    }

    // The refresh call itself failing means the session is genuinely over.
    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw error;
    }

    originalRequest._retried = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw refreshError;
    }
  },
);
