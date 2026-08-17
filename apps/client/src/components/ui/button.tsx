import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "icon";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90",
  secondary:
    "bg-[var(--surface-2)] text-[var(--fg)] hover:bg-[var(--surface-2)]/70",
  outline:
    "border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface-2)]",
  ghost: "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]",
  danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  icon: "h-9 w-9",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
