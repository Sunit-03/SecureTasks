"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// UX-only gate — the actual authorization boundary is the server's
// platformAdminMiddleware (Role.ADMIN + domain/exception check), enforced
// independently on every admin API call. This just avoids showing a
// non-admin the admin shell before their first request 403s.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
