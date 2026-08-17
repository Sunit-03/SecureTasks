"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** CSS color value used for the little dot next to the label */
  color?: string;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  disabled?: boolean;
  className?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  disabled,
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const openMenu = () => {
    setHighlighted(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(options.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const option = options[highlighted];
        if (option) {
          onChange(option.value);
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, options, highlighted, onChange]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm text-[var(--fg)] outline-none transition-colors",
          "hover:border-[var(--accent)]/60 focus:border-[var(--accent)]",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.color && (
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: selected.color }}
            />
          )}
          <span className="truncate">{selected?.label ?? "Select..."}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[var(--fg-muted)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 z-20 mt-1.5 max-h-64 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
            {options.map((option, i) => (
              <button
                key={option.value}
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors cursor-pointer",
                  i === highlighted ? "bg-[var(--surface-2)]" : "",
                  option.value === value ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
                )}
              >
                {option.color && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: option.color }}
                  />
                )}
                <span className="flex-1 truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
