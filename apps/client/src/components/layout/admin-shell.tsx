"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ScrollText, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="flex">
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-[var(--border)] px-3 py-4">
          <Link href="/admin" className="mb-6 px-2 text-sm font-bold tracking-tight text-[var(--fg)]">
            SecureTasks <span className="text-[var(--accent)]">Admin</span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--surface-2)] text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--border)] pt-3">
            <Link
              href="/dashboard"
              className="block px-2.5 py-1.5 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              ← Back to main app
            </Link>
            <div className="mt-1 flex items-center justify-between px-2.5 py-1.5">
              <span className="truncate text-xs text-[var(--fg-muted)]">{user?.email}</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-[var(--danger)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
