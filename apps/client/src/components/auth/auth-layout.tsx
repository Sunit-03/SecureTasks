import Link from "next/link";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const STATS = [
  { value: "92%", label: "Avg sprint health" },
  { value: "4.5k+", label: "Teams onboard" },
];

interface AuthLayoutProps {
  heading: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ heading, subtitle, formTitle, formSubtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-(--bg)">
      <nav className="flex items-center justify-between gap-4 border-b border-(--border) px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-(--fg)">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-(--bg)" />
          </span>
          SecureTasks
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/" className="text-sm font-medium text-(--fg-muted) hover:text-(--fg)">
            ← Back to site
          </Link>
        </div>
      </nav>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        <div className="hidden flex-col justify-between border-(--border) px-16 py-20 lg:flex lg:border-r">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-4 py-1.5 text-xs font-semibold text-(--fg)">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--success)" />
              AI-native project management
            </div>
            <h1 className="max-w-lg text-5xl font-bold leading-[1.05] tracking-tight text-(--fg)">
              {heading}
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-(--fg-muted)">{subtitle}</p>
          </div>

          <div>
            <div className="mb-8 h-px bg-(--border)" />
            <div className="flex gap-10">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-(--fg)">{stat.value}</div>
                  <div className="mt-1 text-sm text-(--fg-muted)">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-16 sm:px-16">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-2xl font-bold tracking-tight text-(--fg)">{formTitle}</h2>
            <p className="mt-2 mb-8 text-sm text-(--fg-muted)">{formSubtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
