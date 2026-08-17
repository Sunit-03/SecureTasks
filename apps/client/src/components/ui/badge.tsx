import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "highlight";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--fg-muted)]",
  accent: "bg-[var(--accent)]/15 text-[var(--accent)]",
  success: "bg-[var(--success)]/15 text-[var(--success)]",
  warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
  danger: "bg-[var(--danger)]/15 text-[var(--danger)]",
  highlight: "bg-[var(--highlight)]/15 text-[var(--highlight)]",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
