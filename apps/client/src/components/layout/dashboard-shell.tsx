"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, BellOff, LogOut } from "lucide-react";
import { useState } from "react";
import { WorkspaceSwitcher } from "@/features/workspace/components/workspace-switcher";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/workspaces", label: "Workspaces" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-bold tracking-tight text-[var(--fg)]">
              SecureTasks
            </Link>
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="rounded-full p-2 text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)] cursor-pointer"
              >
                <Bell className="h-4 w-4" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl">
                    <div className="flex flex-col items-center gap-2 py-3 text-center">
                      <BellOff className="h-5 w-5 text-[var(--fg-muted)]" />
                      <p className="text-xs font-medium text-[var(--fg)]">No new notifications</p>
                      <p className="text-[11px] text-[var(--fg-muted)]">
                        We&apos;ll show updates here soon.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="cursor-pointer">
                <Avatar label={user?.email ?? "?"} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
                    <div className="truncate px-2.5 py-1.5 text-xs text-[var(--fg-muted)]">
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        router.replace("/login");
                      }}
                      className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-[var(--danger)] hover:bg-[var(--surface-2)] cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-6 pb-2">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--surface-2)] text-[var(--fg)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}
