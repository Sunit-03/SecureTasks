"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isLight}
      aria-label="Toggle light/dark theme"
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1 transition-colors cursor-pointer"
    >
      <Sun className="absolute left-1.5 h-3.5 w-3.5 text-[var(--warning)]" />
      <Moon className="absolute right-1.5 h-3.5 w-3.5 text-[var(--fg-muted)]" />
      <span
        className={cn(
          "z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--fg)] shadow transition-transform",
          isLight ? "translate-x-0" : "translate-x-6",
        )}
      />
    </button>
  );
}
