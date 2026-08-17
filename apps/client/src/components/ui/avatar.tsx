import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function initials(label: string) {
  return label.trim().slice(0, 2).toUpperCase();
}

export function Avatar({
  label,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[10px] font-semibold text-[var(--fg-muted)]",
        className,
      )}
      {...props}
    >
      {initials(label)}
    </div>
  );
}
