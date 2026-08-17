import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Search,
  FileText,
  Target,
  Lightbulb,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#stories", label: "Stories" },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Task Generator",
    desc: "Describe a goal in plain English — get a fully scoped task list with estimates and owners in seconds.",
    span: "sm:col-span-3",
    tone: "var(--accent)",
  },
  {
    icon: TrendingUp,
    title: "Sprint Predictor",
    desc: "Forecasts sprint completion odds from velocity history, flags scope creep before standup.",
    span: "sm:col-span-3",
    tone: "var(--success)",
  },
  {
    icon: AlertTriangle,
    title: "Risk Detection",
    desc: "Surfaces stalled tasks and dependency conflicts before they become fires.",
    span: "sm:col-span-2",
    tone: "var(--danger)",
  },
  {
    icon: Search,
    title: "Natural Language Search",
    desc: '"What\'s blocking launch" finds the answer across tasks, comments and docs.',
    span: "sm:col-span-2",
    tone: "var(--accent)",
  },
  {
    icon: FileText,
    title: "Meeting Summary",
    desc: "Drop a transcript, get action items filed straight onto the right board.",
    span: "sm:col-span-2",
    tone: "var(--warning)",
  },
  {
    icon: Target,
    title: "Productivity Coach",
    desc: "Weekly nudges on focus time, meeting load and burnout risk — tuned to how your team actually works.",
    span: "sm:col-span-3",
    tone: "var(--highlight)",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    desc: "Suggests the right assignee, priority and due date the moment a task is created.",
    span: "sm:col-span-3",
    tone: "var(--success)",
  },
];

const TIMELINE = [
  { title: "Describe the goal", desc: "Type what you want in plain language.", tone: "var(--accent)" },
  { title: "AI drafts the plan", desc: "Tasks, estimates and owners appear instantly.", tone: "var(--success)" },
  { title: "Team runs the board", desc: "Drag, comment, ship — with risk flags along the way.", tone: "var(--warning)" },
  { title: "Coach keeps you sharp", desc: "Weekly insights on pace, focus and health.", tone: "var(--highlight)" },
];

const TESTIMONIALS = [
  {
    quote:
      "We replaced three tools with SecureTasks. Standups are shorter and the AI catches risks we used to miss.",
    author: "Maya Chen",
    company: "Northwind",
    highlight: false,
  },
  {
    quote:
      "It genuinely feels alive. Cards animate, the AI drafts sprints for us — my team actually opens it without being asked.",
    author: "Deshawn Ortiz",
    company: "Vertex",
    highlight: true,
  },
  {
    quote: "Our designers stopped complaining about the PM tool. That's new — and it stuck.",
    author: "Priya Nair",
    company: "Kindred",
    highlight: false,
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "For small teams getting started.",
    features: ["Up to 5 members", "Unlimited tasks", "Basic AI suggestions", "1 workspace"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Team",
    price: "$18",
    period: "/user/mo",
    blurb: "For teams shipping every sprint.",
    features: [
      "Unlimited members",
      "Full AI suite + risk detection",
      "Sprint predictor",
      "Unlimited workspaces",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "For orgs with security & scale needs.",
    features: ["SSO & SCIM", "Audit logs", "Dedicated success manager", "Custom AI training"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--bg)">
      {/* NAV */}
      <div className="sticky top-4 z-50 flex justify-center px-4">
        <nav className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-(--border) bg-(--surface)/90 px-3 py-2 pl-5 shadow-lg backdrop-blur">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-(--fg)">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-(--bg)" />
            </span>
            SecureTasks
          </Link>
          <div className="hidden items-center gap-1 text-sm font-medium text-(--fg-muted) md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 transition-colors hover:bg-(--surface-2) hover:text-(--fg)"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-(--fg-muted) hover:text-(--fg) sm:block"
            >
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full">
                Start free <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-4 py-1.5 text-xs font-semibold text-(--fg)">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--success)" />
            AI-native project management, reimagined
          </div>
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-(--fg) sm:text-6xl">
          Work that feels <span className="text-(--accent)">alive</span>, not another{" "}
          <span className="inline-block rounded-xl bg-(--surface-2) px-3 py-0.5">spreadsheet</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-(--fg-muted)">
          SecureTasks plans sprints, drafts tasks, flags risk, and keeps your team on pace — so
          project management finally feels optimistic instead of stressful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup">
            <Button size="md" className="h-11 rounded-full px-7 text-[15px]">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how">
            <Button variant="outline" size="md" className="h-11 rounded-full px-7 text-[15px]">
              See how it works
            </Button>
          </a>
        </div>

        {/* PRODUCT MOCKUP */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute -left-4 -top-5 z-10 hidden rounded-2xl border border-(--border) bg-(--surface) px-4 py-2.5 text-xs font-semibold text-(--fg) shadow-xl sm:block">
            ✦ AI drafted 12 tasks in 4s
          </div>
          <div className="absolute -right-4 bottom-4 z-10 hidden rounded-2xl border border-(--border) bg-(--danger) px-4 py-2.5 text-xs font-semibold text-white shadow-xl sm:block">
            ⚠ Sprint risk: Checkout flow
          </div>

          <div className="rounded-3xl border border-(--border) bg-(--surface) p-3.5 shadow-2xl">
            <div className="flex gap-1.5 px-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-(--danger)" />
              <span className="h-2.5 w-2.5 rounded-full bg-(--warning)" />
              <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-(--bg) p-4">
              <div className="row-span-2 rounded-2xl border border-(--border) bg-(--surface-2) p-4 text-left">
                <div className="text-xs font-semibold text-(--fg-muted)">Today&apos;s Focus</div>
                <div className="mt-2 text-base font-bold text-(--fg)">Ship onboarding v2</div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-(--border)">
                  <div className="h-full w-2/3 rounded-full bg-(--accent)" />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-(--bg) px-2.5 py-1 text-[10px] font-semibold text-(--fg)">
                    3 tasks
                  </span>
                  <span className="rounded-full bg-(--bg) px-2.5 py-1 text-[10px] font-semibold text-(--fg)">
                    Due 5pm
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-(--accent) p-3.5 text-left text-white">
                <div className="text-[11px] font-semibold opacity-85">✦ AI Suggestion</div>
                <div className="mt-2 text-xs font-semibold leading-snug">
                  Split &quot;Payments API&quot; into 3 subtasks
                </div>
              </div>
              <div className="rounded-2xl border border-(--border) bg-(--surface-2) p-3.5 text-left">
                <div className="text-[11px] font-semibold text-(--fg-muted)">Sprint Health</div>
                <div className="mt-1.5 text-2xl font-bold text-(--fg)">92%</div>
              </div>
              <div className="col-span-2 flex items-end gap-1.5 rounded-2xl border border-(--border) bg-(--surface-2) p-3.5">
                {[20, 34, 26, 44, 16, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded"
                    style={{
                      height: h,
                      background: i % 3 === 2 ? "var(--danger)" : "var(--success)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-(--fg-muted)">
          Trusted by teams building the future
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-10 text-lg font-bold text-(--fg-muted)/60">
          <span>NORTHWIND</span>
          <span>Vertex</span>
          <span>haloform</span>
          <span>ORBIT&amp;CO</span>
          <span>Kindred</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-5xl px-6 pt-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-(--fg) sm:text-4xl">
            AI that actually runs the project with you.
          </h2>
          <p className="max-w-xs text-sm text-(--fg-muted)">
            Not a chatbot bolted to the side. Intelligence woven into every card, column and comment.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {FEATURES.map(({ icon: Icon, title, desc, span, tone }) => (
            <Card key={title} className={`flex flex-col justify-between gap-6 p-6 ${span}`}>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb, ${tone} 20%, transparent)` }}
              >
                <Icon className="h-5 w-5" style={{ color: tone }} />
              </div>
              <div>
                <div className="text-base font-semibold text-(--fg)">{title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-(--fg-muted)">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-4xl px-6 pt-28">
        <h2 className="text-center text-3xl font-bold tracking-tight text-(--fg) sm:text-4xl">
          From idea to shipped, in one flow.
        </h2>
        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-(--border) sm:block" />
          {TIMELINE.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border border-(--border) text-sm font-bold text-white"
                style={{ background: step.tone }}
              >
                {i + 1}
              </div>
              <div className="text-sm font-semibold text-(--fg)">{step.title}</div>
              <div className="text-xs text-(--fg-muted)">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories" className="mt-28 bg-(--surface) py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-(--success)">
            Loved by builders
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-(--fg) sm:text-4xl">
            Teams say it&apos;s the first PM tool that doesn&apos;t feel like homework.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className={`rounded-2xl border border-(--border) p-6 ${
                  t.highlight ? "bg-(--accent) text-white" : "bg-(--surface-2) text-(--fg)"
                }`}
              >
                <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-full ${t.highlight ? "bg-white/25" : "bg-(--accent)"}`}
                  />
                  <div className="text-xs font-semibold">
                    {t.author} · {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 pt-28">
        <h2 className="text-center text-3xl font-bold tracking-tight text-(--fg) sm:text-4xl">
          Simple pricing. No surprises.
        </h2>
        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col p-7 ${
                plan.highlight ? "border-(--accent) bg-(--accent)/10 sm:-translate-y-2.5" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-(--fg)">{plan.name}</div>
                {plan.badge && (
                  <span className="rounded-full bg-(--accent) px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {plan.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-(--fg)">{plan.price}</span>
                {plan.period && <span className="text-sm text-(--fg-muted)">{plan.period}</span>}
              </div>
              <p className="mt-2 text-sm text-(--fg-muted)">{plan.blurb}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-(--fg)">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-(--success)" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.name === "Enterprise" ? "#" : "/signup"} className="mt-7 block">
                <Button
                  variant={plan.highlight ? "primary" : "outline"}
                  className="w-full rounded-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-5xl px-6 pt-28">
        <div className="rounded-3xl bg-(--accent) px-8 py-20 text-center">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to actually enjoy project management?
          </h2>
          <Link href="/signup" className="mt-8 inline-block">
            <Button className="h-12 rounded-full bg-(--bg) px-8 text-[15px] text-(--fg) hover:bg-(--bg)/90">
              Get started free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-24 max-w-5xl border-t border-(--border) px-6 pb-16 pt-12">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-(--fg)">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--accent)">
                <span className="h-2 w-2 rounded-[2px] bg-(--bg)" />
              </span>
              SecureTasks
            </div>
            <p className="mt-3 text-sm leading-relaxed text-(--fg-muted)">
              AI-native project management for teams who&apos;d rather build than babysit a board.
            </p>
          </div>
          <div className="flex flex-wrap gap-14 text-sm">
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-(--fg-muted)">
                Product
              </div>
              <a href="#features" className="text-(--fg-muted) hover:text-(--fg)">
                Features
              </a>
              <a href="#pricing" className="text-(--fg-muted) hover:text-(--fg)">
                Pricing
              </a>
              <Link href="/dashboard" className="text-(--fg-muted) hover:text-(--fg)">
                Dashboard
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-(--fg-muted)">
                Company
              </div>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                About
              </a>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                Careers
              </a>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                Blog
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-(--fg-muted)">
                Legal
              </div>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                Privacy
              </a>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                Terms
              </a>
              <a href="#" className="text-(--fg-muted) hover:text-(--fg)">
                Security
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-xs text-(--fg-muted)">
          © 2026 SecureTasks. Made for teams who like their work.
        </div>
      </footer>
    </div>
  );
}
