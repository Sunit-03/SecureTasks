"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

// Matches the server's ACCESS_TOKEN_EXPIRY (apps/server/.env) — the token is
// dead by this point anyway, so an idle logout just makes that explicit
// instead of leaving the user to hit silent 401s.
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;

export function useIdleLogout() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    const handleIdle = () => {
      useAuthStore.getState().logout();
      toast.info("You were logged out after 15 minutes of inactivity");
      router.replace("/login");
    };

    const resetTimer = () => {
      if (!useAuthStore.getState().accessToken) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleIdle, IDLE_TIMEOUT_MS);
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);
}
