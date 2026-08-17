"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 rounded-lg bg-[var(--surface-2)] p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
            active === tab
              ? "bg-[var(--fg)] text-[var(--bg)]"
              : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
