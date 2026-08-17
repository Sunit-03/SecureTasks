# SecureTasks — Current State vs. Project Vision

> Companion to `SecureTasks AI - Project Vision and Tech Stack.md` (the vision/roadmap document) and `docs/KT-Report.md` (the engineering knowledge-transfer doc, which goes deeper on code-level bugs and design decisions). This file answers one question: **of everything the vision document describes, what actually exists in this repo today, and what's the gap?**

Read bottom-up if you want the short version: jump to [§7 Roadmap Phase Checklist](#7-roadmap-phase-checklist) for the one-line-per-phase status, or [§8 Priority Gaps](#8-priority-gaps-if-picking-this-up-next) for what to build next.

---

## 1. Executive Summary

The vision document describes a 7-layer evolution: **Backend Engineering → SaaS Architecture → Frontend Systems → AI Engineering → ML Infrastructure → Agentic AI Systems → Distributed AI Platforms**.

**SecureTasks today has fully delivered the first three layers** (backend engineering, SaaS/multi-tenancy architecture, and a working frontend) — and in the *product* dimension (workspace → project → task → collaboration primitives) has actually gone further than the vision document's own roadmap anticipated for this stage: real-time-feeling collaboration features (comments, threaded replies, @mentions, notifications, a 4-tier RBAC system, per-project customizable Jira-style workflows) exist and work end-to-end, none of which are called out as done in the vision doc's Phase 1–6 scope.

**The AI/ML/distributed-systems layers (roughly half the document — §11, §12 Phases 7–15, most of §10 Redis, and pgvector in §7) are entirely unbuilt.** There is no Redis, no queue, no vector search, no local model hosting, no agentic workflow engine, no real-time transport (WebSockets/Socket.IO), and no deployment infrastructure. Where the UI gestures at AI ("AI Summary — coming soon", static "AI Suggests" copy on the dashboard, a decorative "Sprint Health 72%" ring), those are intentionally-static placeholders, not real AI output.

In short: **the product/SaaS half of the vision is real and working; the AI/ML/infrastructure half hasn't started.** That's not a criticism — the vision document itself frames these as sequential phases, and the project is exactly at the phase boundary it should be at.

---

## 2. What's Actually Built (by vision doc section)

### §3 Core Product Model — ✅ built, and role model exceeds spec

The `User → Workspace → WorkspaceMember → Project → Task` hierarchy is fully implemented, exactly as documented, as the tenant boundary.

**Deviation from spec:** the vision doc specifies three workspace roles (OWNER / ADMIN / MEMBER). The actual system has **four**: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`, with a real per-action permission matrix (Viewer is read-only everywhere; Member can edit workflow fields on any task but content — title/description — only on tasks they created; Admin adds project management, task deletion, and member invites; Owner adds workflow editing and role promotion). This is a deliberate product decision made mid-project, not an oversight — but it means anyone reconciling this doc against the vision doc's RBAC section should expect four roles, not three.

### §4 High-Level Architecture — partially built

Only the **earlier/simpler** architecture diagram in the vision doc is real:

```
Next.js Frontend → Express Backend → Auth Middleware → Controllers → Services → Repositories → PostgreSQL
```

This is implemented faithfully — every backend module (`task`, `project`, `workspace`, `comments`, `notifications`, `workflow-states`) follows this exact layering.

The **final/target** architecture (`Frontend → Backend API → Redis → AI Orchestration → LangGraph → Ollama → PostgreSQL + pgvector`) does not exist. There is no Redis layer, no AI orchestration layer, no LangGraph, no Ollama integration, and no pgvector extension in use.

### §5 Backend Technology Stack — mostly built

| Technology | Status |
|---|---|
| Node.js, Express, TypeScript | ✅ in use |
| Prisma + PostgreSQL | ✅ in use, 10 models, current on migrations |
| Zod | ✅ in use for request validation |
| JWT (access + refresh) | ✅ in use |
| bcrypt | ✅ in use |
| Swagger/OpenAPI | ⚠️ served at `/api-docs`, but **stale** — only covers `auth`, `task`, `project`, `workspace`, `system`; the `comments`, `notifications`, and `workflow-states` modules (and the workspace member-role endpoint) have zero Swagger coverage |
| Helmet | ✅ in use |
| Morgan | ✅ in use (a custom `loggerMiddleware` also exists but is never registered — dead code) |
| express-rate-limit | ✅ in use, global (not scoped per-route — see §8) |
| cookie-parser | ✅ in use |
| **Redis** | ❌ not in `package.json`, not referenced anywhere |
| **BullMQ** | ❌ not present |
| **Socket.IO** | ❌ not present |

### §6 Frontend Technology Stack — fully built

Every listed technology is in active use: Next.js (App Router), TypeScript, React 19, Tailwind CSS v4, Zustand (auth + active-workspace state), TanStack Query (all server state, with optimistic updates), React Hook Form + Zod, and a centralized Axios instance (`lib/api.ts`) with a request interceptor for the JWT and a response interceptor that silently refreshes on 401. The only unbuilt item is **Socket.IO Client** — there is no real-time transport; the notification bell polls every 30 seconds instead of receiving pushed events.

### §7 Database & SaaS Architecture — built, deeper than the vision doc's snapshot

The `User → Workspace → Project → Task` hierarchy with `WorkspaceMember` as the many-to-many join is exactly as documented. The actual schema has grown beyond the vision doc's simple sketch:

- `Task` now has an **assignee**, a **self-referencing parent/subtask relation**, and belongs to a **per-project custom workflow** (see below) instead of a fixed status enum.
- `Comment` (with threaded replies via a self-relation) and `Notification` models exist — neither is mentioned in the vision doc at all.
- `AuditLog` and `ApiKey` models exist in the schema. `AuditLog` is now actively **written to** (every mutating action across tasks/comments/projects/workspaces/workflow-states logs an entry) but there is no API or UI to **read** audit logs yet — write-only. `ApiKey` has a model and nothing else; zero application code touches it.
- **Per-project customizable workflows** (`WorkflowState` model — owner-editable custom statuses with name/color/category/order, replacing a fixed TODO/IN_PROGRESS/DONE enum) exist and work. This is a Jira-style feature the vision doc doesn't mention at all.

**pgvector**: not installed, not referenced. No embeddings, no vector columns, no similarity search of any kind.

### §8 Authentication & Security Direction — built, with known gaps

Signup, login, logout, JWT access tokens, refresh tokens via httpOnly cookie, protected routes, RBAC, and resource-/tenant-level authorization (not just authentication) are all real and enforced server-side (not just hidden in the UI). Ownership authorization (e.g., "only the task's creator or workspace owner can edit its description") and workspace-membership authorization are both implemented as the vision doc describes.

**Known gaps** (see `docs/KT-Report.md` §9 for the full list; highlights):
- No refresh-token rotation or server-side revocation — a leaked refresh token stays valid until it expires; "logout" only clears the client cookie.
- Refresh cookie is `secure: false` hardcoded with no explicit `maxAge`.
- `GET /health` returns every user record including `passwordHash`, unauthenticated — a live data leak, not a design gap.
- Auth endpoints (`signup`/`login`) skip the Zod `validate()` middleware every other module uses.

### §9 API Architecture — built, matches the documented shape

REST, `/api/v1` versioning, Swagger (partial coverage, see §5 above), a `validate()` middleware wrapping Zod schemas, centralized `errorMiddleware`, Morgan request logging, and feature/domain-oriented modules (`modules/task/`, `modules/projects/`, `modules/workspace/`, `modules/comments/`, `modules/notifications/`, `modules/workflow-states/`) all match the vision doc's intent. One naming wrinkle: the `auth` module's code physically lives inside `modules/task/` rather than its own `modules/auth/` folder — cosmetic, but worth knowing before you go looking for it.

### §10 Redis Strategy — 0% built

None of caching, distributed rate limiting, queues (AI/email/notification/embedding jobs), pub/sub, or AI workflow state exist. The vision doc itself says to add Redis only once the core architecture is understood — by that framing, this project has reached the point where Redis would be the *next* infrastructure investment, not before it.

### §11 AI-Native Product Direction — 0% built (by design, this phase hasn't started)

No AI task intelligence, semantic search, duplicate-task detection, RAG, copilots, agentic sprint planning, dependency/blocker analysis, predictive intelligence, AI streaming, or AI observability exists anywhere in the codebase. Every AI-shaped element currently visible in the product is explicitly a **static placeholder**, and is labeled as such in the UI:
- Task detail page: "AI Summary — coming soon... an admin will be able to generate and approve a summary here."
- Dashboard: a static "AI Suggests" card with two hardcoded example strings.
- Dashboard: a "Sprint Health" ring showing a hardcoded `72%`, not a computed value.
- Landing page: marketing copy describing AI features ("AI Task Generator", "Sprint Predictor", etc.) that do not exist yet — this is intentional pre-launch marketing copy, not a misrepresentation bug, but worth flagging if this page is ever treated as documentation of current capability.

---

## 3. Built, But Not Anticipated by the Vision Document

These are real, working features that go beyond what the vision doc's Phase 1–6 scope describes. Listing them separately because they're easy to miss if you only cross-reference against the vision doc:

- **Task assignment** — assign any task to a workspace member; assignee gets a notification.
- **Subtasks** — arbitrary-depth parent/child task linking within a project, with circular-link prevention.
- **Comments with threaded replies** — rich-text (bold/italic/underline/lists), sanitized both client- and server-adjacent, arbitrary reply depth.
- **@Mentions** — mention a workspace member by email in a task description or comment; they get a notification. (No `username` field exists in the schema, so mentions resolve against email — see `docs/KT-Report.md` if a real username field gets added later, this should be revisited.)
- **Notifications** — a real system (not a placeholder): task assignment, subtask linking, priority changes, comment replies, and mentions all generate `Notification` rows, surfaced via a polling bell UI with unread counts and mark-read/mark-all-read.
- **Per-project customizable workflows** — the "customizable states" feature from this session; an owner can add/rename/recolor/reorder/delete custom task statuses per project, each tagged with a To-Do/In-Progress/Done category so aggregate views (dashboard, "is this done") keep working regardless of custom names.
- **Audit logging** — write-side is live across every mutating action; no read/query surface yet (see §8 below).
- **4-tier RBAC** — richer than the vision doc's 3-role spec (see §2 above).

---

## 4. Deployment — 0% built

Nothing in §13 of the vision doc exists yet: no Vercel/Railway/Render config, no Supabase/Neon migration, no Dockerfile, no `docker-compose.yml`, no Nginx config, and no GitHub Actions workflow. The project runs entirely from local `npm run dev` against a locally-running PostgreSQL instance. This is expected at this stage — the vision doc frames deployment as happening alongside/after the AI infrastructure phases — but it's worth stating plainly since "how do I deploy this" currently has no answer in the repo.

---

## 5. Backend Data Model — current schema at a glance

```
User ──< WorkspaceMember >── Workspace ──< Project ──< Task
                                              │           │
                                              │           ├──< Comment ──< Comment (replies, self-relation)
                                              │           ├──< Task (subtasks, self-relation)
                                              │           └──< Notification
                                              │
                                              └──< WorkflowState (per-project custom statuses)

User ──< ApiKey            (model only, unused)
User ──< AuditLog          (write-only, no read API)
```

10 models total: `User`, `Task`, `WorkflowState`, `Comment`, `Notification`, `ApiKey`, `AuditLog`, `Workspace`, `WorkspaceMember`, `Project`. No `pgvector`/embedding-related columns anywhere.

---

## 6. Explicitly Deferred (by the user, not forgotten)

Two features were discussed and deliberately deferred, not overlooked:

- **MFA-gated owner promotion.** The intended workflow: an admin requests to become owner, the workspace owner approves via email + an in-app promotion action, then the role change is applied manually in the database. Not implemented — no request/approval flow, no email integration, no admin UI for it.
- **Workflow-editing details beyond what's built.** The per-project custom-status feature (§3 above) *is* built; anything beyond that (e.g., workflow *transition rules* — which statuses can move to which — as opposed to just an ordered list of statuses) was never specified and isn't built.

---

## 7. Roadmap Phase Checklist

Status against the vision document's own 15-phase roadmap (§12):

| Phase | Scope | Status |
|---|---|---|
| 1 | Backend Foundation | ✅ Done |
| 2 | Authentication | ✅ Done (refresh-token rotation/revocation not done — see §2 gaps) |
| 3 | Task Management | ✅ Done, and exceeded (assignee, subtasks, custom workflows, comments — none specified for this phase) |
| 4 | Production Hardening | ⚠️ Partial — Helmet/logging/rate-limiting/versioning/error-middleware done; **observability not built**; env validation exists but is inconsistently used (some modules read `process.env` directly instead of the validated config) |
| 5 | Workspaces & Multi-Tenancy | ✅ Done, and exceeded (4 roles instead of 3, full per-action permission matrix) |
| 6 | Frontend System | ✅ Done |
| 7 | AI Infrastructure | ❌ Not started |
| 8 | AI Task Intelligence | ❌ Not started (UI placeholders only) |
| 9 | Embeddings & Semantic Search | ❌ Not started |
| 10 | RAG Knowledge System | ❌ Not started |
| 11 | Agentic Workflows | ❌ Not started |
| 12 | Predictive Intelligence | ❌ Not started (dashboard "Sprint Health" is a hardcoded number) |
| 13 | Realtime AI Collaboration | ❌ Not started — notifications exist but are **polled**, not pushed; no WebSocket transport at all |
| 14 | AI Observability | ❌ Not started |
| 15 | Distributed AI Deployment | ❌ Not started |

**6 of 15 phases done or exceeded, 1 partial, 8 not started.** That lines up cleanly with "the SaaS/product layer is done, the AI/ML/distributed layer hasn't begun."

---

## 8. Priority Gaps (if picking this up next)

Roughly in order of leverage — cheapest/highest-impact first:

1. **Swagger coverage** — `comments`, `notifications`, `workflow-states`, and the member-role endpoint have no API docs at all. Cheap to fix, actively misleading (via omission) until it's done.
2. **Audit log read API** — the write side is fully wired; there's no way to actually view an audit trail today. Even a simple `GET /workspaces/:id/audit-log` (owner-only) would close this loop.
3. **`GET /health` data leak** — fix before this is ever exposed outside localhost.
4. **Refresh-token rotation/revocation** — becomes more important the more the app is used, since the silent-refresh interceptor now leans on `/auth/refresh` for every active session.
5. **Redis** (vision doc Phase/§10) — the natural next infrastructure layer per the vision doc's own sequencing, and it unlocks two things already stubbed in the product: real-time notifications (pub/sub → replace the 30s poll) and background jobs (a real queue instead of synchronous notification writes inline in request handlers).
6. **Deployment** (§13) — nothing currently runs outside a developer's machine; even a minimal Docker Compose for Postgres + server + client would be a meaningful step.
7. **AI layer** (§11, Phases 7–10) — the big one, and correctly sequenced last: task intelligence and embeddings need the product surface (which now exists) and ideally Redis/queueing (which doesn't yet) to land well.

---

*This document reflects the state of the codebase as of 2026-08-17. Cross-reference `docs/KT-Report.md` for code-level detail (specific files, line numbers, and bugs) behind the gaps summarized here.*
