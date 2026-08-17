import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none focus:border-[var(--accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
