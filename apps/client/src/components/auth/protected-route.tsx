"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIdleLogout } from "@/hooks/use-idle-logout";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const accessToken = useAuthStore((state) => state.accessToken);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useIdleLogout();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, accessToken, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
