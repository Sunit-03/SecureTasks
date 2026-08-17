import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;

  setAuth: (user: User, accessToken: string) => void;

  logout: () => void;

  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),

      setHasHydrated: (state) =>
        set({
          hasHydrated: state,
        }),
    }),
    {
      name: "securetasks-auth",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
