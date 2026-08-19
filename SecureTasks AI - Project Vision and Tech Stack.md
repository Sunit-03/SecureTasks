# SecureTasks AI --- Project Vision & Technology Architecture

## 1. Document Purpose

This document defines the overall vision, architectural direction,
technology choices, current build status, and phased evolution of
SecureTasks AI.

The project began as a backend-learning system called SecureTasks and
evolved into an AI-native collaborative engineering platform. The
documented direction combines backend engineering, SaaS architecture,
frontend systems, AI engineering, ML infrastructure, agentic workflows,
real-time collaboration, and distributed-system concepts.

> **Status note:** This revision distinguishes three states explicitly:
> **Built** (implemented and deployed today), **Planned — near-term**
> (scoped, next in line), and **Planned — roadmap** (AI, Redis, real-time,
> and distributed components, direction agreed but not yet started).
> Earlier drafts of this document described most of the system as
> aspirational; as of this revision, the core product — auth, workspaces,
> projects, tasks, comments, notifications, audit logging, and a deployed
> production environment — is built and live.

## 2. Product Vision

SecureTasks AI is intended to become an **AI-powered engineering
operations platform** inspired by the problem space of Jira, Linear, and
Notion.

The long-term product combines:

-   collaborative workspaces and project management
-   task and workflow management
-   AI copilots
-   semantic organizational memory
-   contextual knowledge retrieval
-   autonomous workflow generation
-   sprint intelligence
-   predictive operational intelligence
-   real-time collaboration
-   local AI inference
-   agentic workflows
-   production-oriented infrastructure

The project is deliberately broader than a CRUD portfolio application.
Its purpose is to evolve through the major layers of modern software
engineering:

``` text
Backend Engineering        ← built
        ↓
SaaS Architecture           ← built (single-tenant-per-workspace model)
        ↓
Frontend Systems             ← built
        ↓
Platform Governance          ← in progress (admin layer, plans/tiers)
        ↓
AI Engineering                ← planned
        ↓
ML Infrastructure              ← planned
        ↓
Agentic AI Systems               ← planned
        ↓
Distributed AI Platforms           ← planned
```

## 3. Core Product Model

The application has evolved from a personal task system into a
collaborative, multi-tenant hierarchy that is fully built and deployed:

``` text
User
  ↓
Workspace  (tenant boundary, has an Owner)
  ↓
Workspace Members  (role: OWNER, ADMIN, MEMBER, VIEWER)
  ↓
Projects
  ↓
Workflow States  (customizable per-project columns: name, color, order)
  ↓
Tasks  (status, priority, assignee, parent/subtask links)
  ↓
Comments  (threaded replies) + Notifications
```

Supporting entities that exist alongside this hierarchy:

-   **AuditLog** — action, actor, IP, metadata, optionally scoped to a
    workspace; exposed today per-workspace at
    `/workspaces/:id/audit-log`.
-   **RefreshToken** — one row per issued session, supports rotation and
    revocation (see Section 8).
-   **ApiKey** — hashed API keys with expiry, scaffolded in the schema for
    future programmatic access.

Workspace roles are:

-   OWNER
-   ADMIN
-   MEMBER
-   VIEWER

A **global** role also exists independently of any workspace:

-   USER
-   ADMIN (platform admin — see Section 10)

The architectural goal — that users can access only the workspaces and
resources for which they are authorized — is enforced today at the
repository layer via workspace-membership scoping on every query.

## 4. High-Level Architecture

### 4.1 Current, deployed architecture (Built)

``` text
Next.js Frontend (Vercel)
        ↓  HTTPS, credentials: include
Express Backend (Render, free tier)
        ↓
Prisma ORM
        ↓
PostgreSQL (Neon, free tier)
```

Frontend and backend are deployed and reachable as separate services with
independent deploy pipelines (git push → auto-deploy on both platforms).
Full deployment mechanics — including an AWS EC2/RDS path and the
Vercel + Render + Neon free-tier path actually in use — are documented
separately in `docs/aws-deployment-guide.md` and
`docs/vercel-render-deployment-guide.md`.

### 4.2 Target long-term architecture (Roadmap)

``` text
Frontend (Next.js)
        ↓
Backend API (Node.js + Express)
        ↓
Redis Layer
        ↓
AI Orchestration Layer
        ↓
LangGraph Workflows
        ↓
Ollama Local Models
        ↓
PostgreSQL + pgvector
```

### 4.3 Backend request architecture (Built)

``` text
Next.js Frontend
        ↓
API Layer
        ↓
Express Backend
        ↓
Auth Middleware
        ↓
Controllers
        ↓
Services
        ↓
Repositories
        ↓
PostgreSQL
```

This layered approach establishes separation of concerns between HTTP
handling, business logic, database access, authentication, and
infrastructure, and is implemented consistently across every existing
module.

## 5. Backend Technology Stack

  -----------------------------------------------------------------------
  Category                Technology              Status / Role
  ----------------------- ----------------------- -----------------------
  Runtime                 Node.js                 Built

  Framework               Express.js 5             Built

  Language                TypeScript              Built

  ORM                     Prisma                  Built

  Database                PostgreSQL (Neon)       Built — production
                                                  database is live

  Validation              Zod                     Built

  Authentication          JWT (access + refresh)   Built — with rotation
                                                  and reuse detection

  Password hashing        bcrypt                  Built

  API documentation       Swagger/OpenAPI         Built — `/api-docs`

  Security                Helmet                  Built

  Logging                 Morgan                  Built

  Rate limiting           express-rate-limit      Built — in-memory,
                                                  single-instance only
                                                  (see Section 11)

  Cookies                 cookie-parser           Built — HttpOnly,
                                                  env-aware
                                                  secure/sameSite

  Cache/infrastructure    Redis                   Planned — near-term
                                                  (ban/block-list,
                                                  job queue)

  Queues                  BullMQ                  Planned — near-term,
                                                  tied to bulk import
                                                  (Section 12)

  Realtime                Socket.IO               Planned — roadmap
  -----------------------------------------------------------------------

The backend is a clean modular monolith, organized by domain under
`src/modules/`: `auth`, `task`, `workspace`, `projects`,
`workflow-states`, `comments`, `notifications`, `audit-log`. Each module
follows the same routes → controller → service → repository layering.

## 6. Frontend Technology Stack

  -----------------------------------------------------------------------
  Category                Technology              Status / Role
  ----------------------- ----------------------- -----------------------
  Framework               Next.js (App Router)    Built

  Language                TypeScript              Built

  UI                      React                   Built

  Styling                 Tailwind CSS            Built

  Client state             Zustand                 Built — auth state

  Server state             TanStack React Query    Built

  Forms                    React Hook Form         Built

  Validation               Zod                     Built

  API layer                 Axios                   Built — centralized
                                                    client with access-
                                                    token refresh
                                                    interceptor

  Drag & drop               @dnd-kit                Built — board/task
                                                    interactions

  Notifications (UI)         sonner                  Built — toast layer

  Icons                       lucide-react            Built

  Sanitization                 isomorphic-dompurify    Built — user
                                                        content rendering

  Realtime                     Socket.IO Client        Planned — roadmap
  -----------------------------------------------------------------------

Built and live today: landing page, login/signup (auth flows wired to
the backend, cookie-based refresh), a dashboard shell, workspace views,
project views, and a task board (`/dashboard/{workspaces,projects,tasks}`).
The frontend uses protected routes gated on auth state, a centralized
Axios SDK, and Next.js's `.env` / `.env.production` mode-based
environment loading so the same codebase points at `localhost` in
development and the deployed API URL in production without code changes.

## 7. Database & SaaS Architecture

PostgreSQL (hosted on Neon) is the persistent source of truth in
production.

The relational model, as actually implemented:

``` text
User
  ↓ (owns)                ↓ (member of, via WorkspaceMember)
Workspace ───────────────────┘
  ↓
Project
  ↓
WorkflowState (per-project, customizable columns)
  ↓
Task ── parentTask/subtasks (self-relation)
  ↓
Comment ── parentComment/replies (self-relation, threaded)

Task/Workspace → AuditLog
User → RefreshToken, ApiKey, Notification
```

Many-to-many tenancy is modeled explicitly:

``` text
User ↔ Workspace
      via WorkspaceMember (role: OWNER | ADMIN | MEMBER | VIEWER)
```

The system uses, in production:

-   primary and foreign keys
-   relational modeling
-   many-to-many relationships (`WorkspaceMember`)
-   self-relations (`Task` parent/subtask, `Comment` threading)
-   indexes (`@@index` on `AuditLog.workspaceId`, `RefreshToken.userId`)
-   unique constraints (`WorkspaceMember` composite, `WorkflowState`
    per-project name)
-   `onDelete` cascade/set-null strategies chosen per relation
-   migrations (10 applied to date, tracked in `prisma/migrations`)
-   hierarchical authorization
-   tenant boundaries enforced at the repository layer

pgvector is planned as the vector-search layer alongside PostgreSQL for
embeddings and semantic retrieval, once the AI layer begins (Section 13).

## 8. Authentication & Security Direction

Authentication (Built):

-   signup / login / logout
-   JWT access tokens
-   refresh tokens with **rotation on every use** and **reuse detection**
    (a replayed, already-rotated-out token revokes every session for that
    user — theft response, not just rejection)
-   HTTP-only, environment-aware cookies (`secure`/`sameSite` switch
    automatically between local dev and production via `NODE_ENV`, since
    the deployed frontend and backend live on different platforms/domains)
-   protected routes (frontend)
-   RBAC — both global (`Role`) and workspace-scoped (`WorkspaceRole`)
-   token lifecycle management via a `RefreshToken` table (issuance,
    rotation, revocation all tracked, not purely stateless JWTs)

Security infrastructure (Built):

-   bcrypt password hashing
-   JWT signing (separate access/refresh secrets)
-   Helmet
-   CORS, restricted to the deployed client origin via `CLIENT_URL`
-   rate limiting (per-instance; see Section 11 for the distributed
    limitation)
-   Zod request validation
-   centralized error handling middleware
-   ownership authorization (task creator/assignee checks)
-   workspace membership authorization (every workspace-scoped query is
    membership-checked)

A key architectural distinction maintained throughout:

``` text
Authentication = Who is the user?
Authorization  = What is the user allowed to access?
```

The project treats authentication as necessary but not sufficient —
resource-level and tenant-level authorization are enforced independently
at the repository layer on every query, not assumed from a valid token
alone.

**Planned — near-term:** MFA (shared across both the Team and
Organization plans described in Section 12, not duplicated per tier).

## 9. API Architecture

``` text
Request
  ↓
Middleware  (auth, rate limit, CORS, helmet)
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Built and in production use:

-   REST APIs
-   API versioning (`/api/v1`)
-   Swagger/OpenAPI, live at `/api-docs`
-   Zod validation middleware
-   centralized error handling
-   request logging (Morgan)
-   structured middleware pipelines
-   feature/domain-oriented modules

``` text
src/modules/
  auth/
  task/
  workspace/
  projects/
  workflow-states/
  comments/
  notifications/
  audit-log/
```

## 10. Platform Admin Layer

*(Status: Planned — near-term, first of the four active vision items,
prioritized ahead of the others because the primitives it needs —
`Role.ADMIN`, `AuditLog` — already exist in the schema.)*

A platform admin dashboard sits above the existing tenant model rather
than inside it. It is documented separately because it does not slot
cleanly into the workspace-scoped architecture described in Sections 3
and 9 — it deliberately cuts across tenant boundaries that the rest of
the system is built to enforce.

### 10.1 What already exists

Two authorization axes are already in the schema and middleware:

``` text
Role            (global)     — USER, ADMIN
WorkspaceRole   (per-tenant) — OWNER, ADMIN, MEMBER, VIEWER
```

`requiredRole()` can already gate a route on global `Role.ADMIN`, and an
`AuditLog` model already exists — but today it is only ever queried
per-workspace. Global `Role.ADMIN` is otherwise dormant: nothing
currently gives a platform admin visibility or control beyond a single
stub route.

### 10.2 What a platform admin dashboard changes

**A new, parallel module.** Following the existing
`src/modules/{task,workspace,project,auth}` convention, admin
functionality becomes its own `src/modules/admin/` (routes → controller →
service → repository), authorized entirely by global `Role.ADMIN` and
independent of `WorkspaceRole` — an admin does not become a member of
every workspace to gain visibility into it.

**Repository-layer bypass of tenant scoping.** Every repository today
scopes queries by workspace membership — that boundary is the core of the
current authorization model. An admin dashboard needs to read *across*
workspaces (all tasks, all comments, all users), which means explicit
admin-only repository methods that skip the membership join
(`adminTaskRepository.findAllAcrossWorkspaces()`), kept clearly separate
from the member-facing ones — not a bypass flag threaded through shared
query logic. This keeps the tenant-isolation guarantee intact for every
normal code path and makes the admin bypass an explicit, auditable
exception.

**Auth middleware stops being fully stateless.** `authMiddleware`
currently only verifies the JWT signature — no database lookup happens
per request. Banning a user requires rejecting requests from an
already-issued, still-valid access token, which a pure signature check
cannot do. This forces a lookup (or cache check) on every authenticated
request going forward — the first concrete use case that turns the Redis
layer (Section 11) from "planned" into "needed soon": a fast
ban/block-list check in Redis is far cheaper per-request than a Postgres
round trip on every API call.

**"Workspace viewer by default" is a new, distinct authorization rule.**
An admin can *see* any workspace but not *edit* one unless separately
granted — not expressible with the current `WorkspaceRole` enum, since an
admin isn't a `VIEWER` member of every workspace (that would mean
creating phantom `WorkspaceMember` rows for every admin/workspace pair).
It needs to be enforced as a rule in the authorization layer itself:
platform admin ⇒ read access everywhere by default; write access requires
an explicit, auditable elevation. This reuses the same approval-request
pattern as the ownership-transfer flow in Section 12.3 — build that
pattern once, apply it in both places.

**Frontend gets a second protected surface.** `protected-route.tsx`
currently gates on workspace membership. An `/admin` route tree needs its
own gate on global `Role.ADMIN`, structurally separate from the
workspace-membership check.

**Admin analytics run against the primary database, for now.** At current
scale, aggregate queries (new users over time, activity counts, workspace
growth) can run directly against Postgres with reasonable indexes — no
new infrastructure is required to ship a first version. As usage grows,
heavy admin-dashboard aggregation is the kind of workload that eventually
wants isolating from transactional traffic (a read replica, or
precomputed rollups) — a later scaling decision, not a prerequisite.

### 10.3 Net effect

The admin dashboard introduces a second authorization axis that the auth
middleware, the repository layer, and the frontend route guards all need
to account for explicitly. It is also the feature that makes the
ban/block-list use case — and therefore Redis — concretely necessary
rather than speculative.

## 11. Redis Strategy

*(Status: Planned — near-term for two specific uses below; the remaining
uses are roadmap.)*

Redis is not intended to replace PostgreSQL. PostgreSQL remains the
persistent source of truth; Redis acts as an acceleration and
infrastructure layer, introduced when a concrete need exists rather than
speculatively.

### Near-term, concrete drivers

-   **Ban/block-list checks** — driven directly by the platform admin
    layer (Section 10.2): rejecting requests from a banned user's
    still-valid JWT requires a fast per-request lookup. Redis, not
    Postgres, is the right place for this.
-   **Job queue (BullMQ)** — driven by bulk member import (Section 12,
    Organization plan): importing members from an Excel file should be an
    async background job, not synchronous request handling.
-   **Distributed rate limiting** — `express-rate-limit`'s in-memory store
    is correct for a single Render instance today, but becomes incorrect
    the moment the API scales to more than one instance (each process
    gets its own counter). Needed only once horizontal scaling actually
    happens, not before.

### Roadmap uses (unchanged direction, not yet scheduled)

-   **Caching** — workspace cache, dashboard cache, task cache, AI
    response cache.
-   **Pub/Sub** — realtime updates, notifications, WebSocket event
    distribution.
-   **AI state** — temporary workflow state, agent progress,
    conversation/workflow state.

Redis is deliberately not being introduced ahead of a concrete driver —
the two near-term uses above are what justify standing it up next,
not a general "we'll need it eventually."

## 12. Plans, Tiers & Organization Governance

*(Status: Planned — near-term, second of the four active vision items,
largest in scope. This section is a directional outline, not a
build-ready spec — treat as its own planning pass once started.)*

Two tiers are planned:

### 12.1 Team plan (2–10 people)

Builds directly on what already exists: workspaces, projects, tasks,
comments, notifications, RBAC. The one addition planned for this tier is
**MFA**, which — per Section 8 — is built once at the platform level and
shared with the Organization tier rather than duplicated.

### 12.2 Organization plan (10–100+ people)

A materially larger surface, layered on top of the Team plan:

-   **Organization identity** — membership gated by organization email
    domain, with a manual approval process for anyone outside it. This is
    a new authorization concept: workspace/organization membership
    conditioned on identity attributes (email domain), not just an invite
    or an approval click.
-   **SSO** — organization-level identity federation, a materially
    different authentication path from the existing email/password + JWT
    flow in Section 8.
-   **Bulk member import (Excel)** — see Section 11: this is the concrete
    driver for introducing a background job queue.
-   **Fully customizable dashboard** — a SaaS-style, per-organization
    configurable dashboard. This is the single largest piece of new
    frontend architecture in the whole roadmap — effectively a small
    dashboard-builder product in its own right, not a page.

### 12.3 Workspace ownership transfer

*(Status: Planned — near-term, third of the four active vision items,
smallest and best scoped, sequenced before Section 12's larger surface
specifically to validate the approval-flow pattern that both the
Organization plan and the admin layer reuse.)*

Promoting a workspace admin to workspace owner: request raised → owner
approval → change applied. The `Workspace.ownerId` field already exists
as a single-owner pointer, so this is primarily a workflow/process
feature (an approval request record, a notification, an owner-facing
approval action) rather than a schema redesign — the transfer itself is
one `ownerId` update once approved.

### 12.4 Sequencing note

Recommended build order across these three items plus the admin layer is
**Admin layer → Ownership transfer → Plans/Organization tier**: the admin
layer is closest to already-built primitives, ownership transfer proves
out the approval-request pattern at small scale, and the Organization
tier reuses that pattern while adding genuinely new surfaces (billing,
SSO, bulk import, dashboard builder) that justify tackling it last.

## 13. AI-Native Product Direction

*(Status: Planned — roadmap. Deliberately sequenced after platform
governance: AI insights are more useful once there is real usage and
audit data, from Section 10, to draw on.)*

The AI layer transforms SecureTasks from a project-management
application into an AI-native engineering platform.

Its intended capabilities include:

-   AI task intelligence
-   semantic search
-   duplicate-task detection
-   workspace knowledge retrieval
-   RAG-based organizational memory
-   AI copilots
-   agentic sprint planning
-   dependency analysis
-   blocker detection
-   predictive sprint intelligence
-   AI streaming
-   AI observability

The complete AI architecture is documented separately in **SecureTasks
AI --- AI Layer Architecture & Engineering Documentation**.

## 14. Development Roadmap

### Phase 1 --- Backend Foundation ✅ Built

-   Express + TypeScript
-   PostgreSQL
-   Prisma
-   layered architecture
-   environment configuration
-   Swagger

### Phase 2 --- Authentication ✅ Built

-   signup/login
-   JWT access + refresh tokens, rotation, reuse detection
-   HTTP-only cookies
-   RBAC (global + workspace)
-   protected routes

### Phase 3 --- Task Management ✅ Built

-   CRUD
-   validation
-   ownership
-   subtasks (self-relation)
-   priority, customizable workflow states
-   modular architecture

### Phase 4 --- Production Hardening ✅ Built

-   Helmet
-   logging
-   rate limiting
-   environment validation
-   API versioning
-   error middleware

### Phase 5 --- Workspaces & Multi-Tenancy ✅ Built

-   workspaces
-   projects
-   memberships
-   workspace roles
-   hierarchical ownership
-   tenant authorization

### Phase 6 --- Collaboration Layer ✅ Built

-   threaded comments
-   notifications
-   audit logging

### Phase 7 --- Frontend System ✅ Built

-   Next.js App Router
-   auth persistence, cookie-based refresh flow
-   API SDK (Axios)
-   dashboard, workspace, project, task views
-   drag-and-drop board interactions

### Phase 8 --- Production Deployment ✅ Built

-   Vercel (frontend), Render (backend), Neon (Postgres) — free tier
-   environment-mode-based API URL switching
-   AWS EC2/RDS path documented as an alternative

### Phase 9 --- Platform Admin Layer 🔶 Planned — near-term

-   global-admin module, cross-tenant read repositories
-   ban/block-list (first Redis driver)
-   read-everywhere/write-on-grant authorization rule
-   admin frontend route tree

### Phase 10 --- Workspace Ownership Transfer 🔶 Planned — near-term

-   approval-request record + notification
-   owner-facing approval action

### Phase 11 --- Plans & Organization Tier 🔶 Planned — near-term

-   Team plan + shared MFA
-   Organization plan: domain-gated membership + approval, SSO, bulk
    import (second Redis driver: job queue), customizable dashboard

### Phase 12 --- Redis Infrastructure 🔶 Planned — near-term

-   ban/block-list cache
-   BullMQ job queue (bulk import)
-   distributed rate limiting (once horizontally scaled)

### Phase 13 --- AI Infrastructure 🔷 Planned — roadmap

-   Ollama
-   local model hosting
-   AI microservice
-   inference abstraction
-   model routing
-   prompt templates

### Phase 14 --- AI Task Intelligence 🔷 Planned — roadmap

-   task breakdown
-   acceptance criteria
-   summaries
-   sprint summaries
-   prioritization

### Phase 15 --- Embeddings & Semantic Search 🔷 Planned — roadmap

-   embeddings
-   pgvector
-   semantic search
-   similarity retrieval
-   duplicate detection

### Phase 16 --- RAG Knowledge System 🔷 Planned — roadmap

-   workspace knowledge assistant
-   documentation retrieval
-   project context
-   organizational memory
-   context injection

### Phase 17 --- Agentic Workflows 🔷 Planned — roadmap

-   LangGraph
-   sprint planner
-   dependency analyzer
-   blocker detection
-   tool calling
-   stateful workflows

### Phase 18 --- Predictive Intelligence 🔷 Planned — roadmap

-   sprint risk
-   workload analysis
-   delay prediction
-   completion estimation
-   anomaly detection

### Phase 19 --- Realtime AI Collaboration 🔷 Planned — roadmap

-   WebSockets
-   streaming AI
-   realtime updates
-   notifications
-   event-driven workflows

### Phase 20 --- AI Observability 🔷 Planned — roadmap

-   prompt versioning
-   tracing
-   evaluation pipelines
-   hallucination monitoring
-   token monitoring
-   latency analytics

### Phase 21 --- Distributed AI Deployment 🔷 Planned — roadmap

-   distributed services
-   containerized AI
-   GPU deployment
-   service orchestration
-   inference scaling

## 15. Deployment Direction

### 15.1 Current, live deployment (Built)

  Layer              Technology              Cost
  ------------------ ----------------------- -----------------------
  Frontend           Vercel (Hobby)          Free
  Backend API        Render (free Web Service) Free (sleeps when idle)
  Database           Neon (free tier)        Free
  Domain             `*.vercel.app` / `*.onrender.com` | Free (custom domain optional, ~$70–130/yr for `.ai`)

Full step-by-step setup is documented in
`docs/vercel-render-deployment-guide.md`.

### 15.2 Alternative / future path

  Layer              Planned Technology
  ------------------ --------------------
  Frontend           Vercel
  Backend API        AWS EC2 (documented alternative) / Railway
  Database           AWS RDS (documented alternative) / Supabase
  Vector search       pgvector
  AI service           GPU VPS
  Models                Ollama containers
  Containerization       Docker
  Reverse proxy           Nginx
  CI/CD                     GitHub Actions

The AWS path (EC2 + RDS + Nginx + Certbot) is fully documented in
`docs/aws-deployment-guide.md` as a documented alternative to the current
Vercel/Render/Neon deployment — useful once free-tier limits (cold
starts, connection limits) become a real constraint, or once
self-hosting AI inference makes a single-VPC architecture attractive.

## 16. Final Product Outcome

The intended final SecureTasks AI platform supports:

-   collaborative workspaces ✅ Built
-   project management ✅ Built
-   platform governance (admin layer, plans, ownership transfer) 🔶 Planned — near-term
-   intelligent task systems 🔷 Planned — roadmap
-   AI copilots 🔷 Planned — roadmap
-   semantic knowledge retrieval 🔷 Planned — roadmap
-   autonomous workflow generation 🔷 Planned — roadmap
-   AI sprint planning 🔷 Planned — roadmap
-   predictive analytics 🔷 Planned — roadmap
-   realtime collaboration 🔷 Planned — roadmap
-   local AI inference 🔷 Planned — roadmap
-   agentic workflows 🔷 Planned — roadmap
-   scalable SaaS infrastructure — partially built, partially planned
-   distributed AI infrastructure 🔷 Planned — roadmap

The project therefore serves two purposes simultaneously:

1.  A real engineering product — currently a deployed, working
    multi-tenant task management platform with authentication,
    workspaces, projects, tasks, comments, notifications, and audit
    logging.
2.  A structured learning system covering backend, frontend, SaaS
    governance, AI, ML infrastructure, agents, and distributed systems —
    each phase in Section 14 chosen deliberately for what it teaches, not
    only for what it ships.
