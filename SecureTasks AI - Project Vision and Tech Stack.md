# SecureTasks AI --- Project Vision & Technology Architecture

## 1. Document Purpose

This document defines the overall vision, architectural direction,
technology choices, capabilities, and phased evolution of SecureTasks
AI.

The project began as a backend-learning system called SecureTasks and
evolved into an AI-native collaborative engineering platform. The
documented direction combines backend engineering, SaaS architecture,
frontend systems, AI engineering, ML infrastructure, agentic workflows,
real-time collaboration, and distributed-system concepts.

> **Status note:** This document distinguishes the intended
> architecture/roadmap from functionality already established in the
> project discussions. AI, Redis, real-time, predictive, and distributed
> components are primarily roadmap/planned capabilities unless
> explicitly marked otherwise.

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
Backend Engineering
        ↓
SaaS Architecture
        ↓
Frontend Systems
        ↓
AI Engineering
        ↓
ML Infrastructure
        ↓
Agentic AI Systems
        ↓
Distributed AI Platforms
```

## 3. Core Product Model

The application evolves from a personal task system into a collaborative
hierarchy:

``` text
User
  ↓
Workspace
  ↓
Workspace Members
  ↓
Projects
  ↓
Tasks
```

The workspace is the fundamental tenant boundary. Workspace roles are:

-   OWNER
-   ADMIN
-   MEMBER

The architectural goal is that users can access only the workspaces and
resources for which they are authorized.

## 4. High-Level Architecture

The documented final architecture is:

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

The earlier core backend architecture is:

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
infrastructure.

## 5. Backend Technology Stack

  -----------------------------------------------------------------------
  Category                Technology              Role
  ----------------------- ----------------------- -----------------------
  Runtime                 Node.js                 JavaScript/TypeScript
                                                  server runtime

  Framework               Express.js              HTTP/API framework

  Language                TypeScript              Type-safe application
                                                  development

  ORM                     Prisma                  Type-safe relational
                                                  database access

  Database                PostgreSQL              Persistent relational
                                                  source of truth

  Validation              Zod                     Runtime request/config
                                                  validation

  Authentication          JWT                     Access-token
                                                  authentication

  Password hashing        bcrypt                  Password hashing

  API documentation       Swagger/OpenAPI         API contracts and
                                                  interactive
                                                  documentation

  Security                Helmet                  HTTP security headers

  Logging                 Morgan + custom logging Request/operational
                                                  logging

  Rate limiting           express-rate-limit      API abuse protection

  Cookies                 cookie-parser           Cookie handling

  Cache/infrastructure    Redis                   Planned caching,
                                                  queues, rate limiting,
                                                  pub/sub, AI state

  Queues                  BullMQ                  Planned Redis-backed
                                                  background jobs

  Realtime                Socket.IO               Planned realtime
                                                  collaboration
  -----------------------------------------------------------------------

The backend is intentionally built around a clean monolith first rather
than immediately adopting microservices.

## 6. Frontend Technology Stack

  -----------------------------------------------------------------------
  Category                Technology              Role
  ----------------------- ----------------------- -----------------------
  Framework               Next.js                 Full-stack React
                                                  framework and
                                                  application UI

  Language                TypeScript              Type-safe frontend

  UI                      React                   Component system

  Styling                 Tailwind CSS            UI styling

  Client state            Zustand                 Application/client
                                                  state

  Server state            React Query             Caching, fetching,
                                                  invalidation, server
                                                  state

  Forms                   React Hook Form         Form management

  Validation              Zod                     Client-side/runtime
                                                  validation

  API layer               Axios/Fetch SDK         Centralized backend
                                                  communication

  Realtime                Socket.IO Client        Planned realtime UI
                                                  updates
  -----------------------------------------------------------------------

The frontend direction includes App Router, protected routes,
authentication persistence, reusable UI components, optimistic updates,
and a centralized API SDK.

## 7. Database & SaaS Architecture

PostgreSQL is the persistent source of truth.

The relational model has evolved through:

``` text
User → Tasks
```

to:

``` text
User
  ↓
Workspace
  ↓
Project
  ↓
Task
```

with a many-to-many membership relationship:

``` text
User ↔ Workspace
      via WorkspaceMember
```

The system therefore teaches and uses:

-   primary and foreign keys
-   relational modeling
-   many-to-many relationships
-   indexes
-   constraints
-   migrations
-   transactions
-   hierarchical authorization
-   tenant boundaries

pgvector is planned as the vector-search layer alongside PostgreSQL for
embeddings and semantic retrieval.

## 8. Authentication & Security Direction

Authentication includes:

-   signup
-   login
-   logout
-   JWT access tokens
-   refresh tokens
-   HTTP-only cookies
-   protected routes
-   RBAC
-   token lifecycle management
-   session concepts

Security infrastructure includes:

-   bcrypt password hashing
-   JWT signing
-   Helmet
-   CORS protection
-   rate limiting
-   environment validation
-   centralized error handling
-   ownership authorization
-   workspace membership authorization

A key architectural distinction is:

``` text
Authentication = Who is the user?
Authorization  = What is the user allowed to access?
```

The project also explicitly introduces resource-level and tenant-level
authorization rather than treating authentication as sufficient.

## 9. API Architecture

The backend follows:

``` text
Request
  ↓
Middleware
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

The project uses:

-   REST APIs
-   API versioning
-   Swagger/OpenAPI
-   validation middleware
-   centralized error handling
-   request logging
-   structured middleware pipelines
-   feature/domain-oriented modules

Feature-based modules are intended to scale better as the system grows:

``` text
src/modules/
  task/
  workspace/
  project/
  auth/
```

## 10. Redis Strategy

Redis is not intended to replace PostgreSQL. PostgreSQL remains the
persistent source of truth; Redis acts as an acceleration and
infrastructure layer.

Planned Redis uses include:

### Caching

-   workspace cache
-   dashboard cache
-   task cache
-   AI response cache

### Rate limiting

-   distributed request counters
-   request tracking

### Queues

-   AI jobs
-   email jobs
-   notification jobs
-   embedding-generation jobs

### Pub/Sub

-   realtime updates
-   notifications
-   WebSocket event distribution

### AI state

-   temporary workflow state
-   agent progress
-   conversation/workflow state

The project discussions explicitly recommend adding Redis after the core
architecture is understood rather than introducing it prematurely.

## 11. AI-Native Product Direction

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

## 12. Development Roadmap

### Phase 1 --- Backend Foundation

-   Express + TypeScript
-   PostgreSQL
-   Prisma
-   layered architecture
-   environment configuration
-   Swagger

### Phase 2 --- Authentication

-   signup/login
-   JWT
-   refresh tokens
-   cookies
-   RBAC
-   protected routes

### Phase 3 --- Task Management

-   CRUD
-   validation
-   ownership
-   pagination
-   filtering
-   DTOs
-   modular architecture

### Phase 4 --- Production Hardening

-   Helmet
-   logging
-   rate limiting
-   environment validation
-   API versioning
-   observability
-   error middleware

### Phase 5 --- Workspaces & Multi-Tenancy

-   workspaces
-   projects
-   memberships
-   workspace roles
-   hierarchical ownership
-   tenant authorization

### Phase 6 --- Frontend System

-   Next.js App Router
-   auth persistence
-   API SDK
-   reusable UI
-   optimistic updates
-   state management

### Phase 7 --- AI Infrastructure

-   Ollama
-   local model hosting
-   AI microservice
-   inference abstraction
-   model routing
-   prompt templates

### Phase 8 --- AI Task Intelligence

-   task breakdown
-   acceptance criteria
-   summaries
-   sprint summaries
-   prioritization

### Phase 9 --- Embeddings & Semantic Search

-   embeddings
-   pgvector
-   semantic search
-   similarity retrieval
-   duplicate detection

### Phase 10 --- RAG Knowledge System

-   workspace knowledge assistant
-   documentation retrieval
-   project context
-   organizational memory
-   context injection

### Phase 11 --- Agentic Workflows

-   LangGraph
-   sprint planner
-   dependency analyzer
-   blocker detection
-   tool calling
-   stateful workflows

### Phase 12 --- Predictive Intelligence

-   sprint risk
-   workload analysis
-   delay prediction
-   completion estimation
-   anomaly detection

### Phase 13 --- Realtime AI Collaboration

-   WebSockets
-   streaming AI
-   realtime updates
-   notifications
-   event-driven workflows

### Phase 14 --- AI Observability

-   prompt versioning
-   tracing
-   evaluation pipelines
-   hallucination monitoring
-   token monitoring
-   latency analytics

### Phase 15 --- Distributed AI Deployment

-   distributed services
-   containerized AI
-   GPU deployment
-   service orchestration
-   inference scaling

## 13. Deployment Direction

The documented deployment direction is:

  Layer              Planned Technology
  ------------------ --------------------
  Frontend           Vercel
  Backend API        Railway / Render
  Database           Supabase / Neon
  Vector search      pgvector
  AI service         GPU VPS
  Models             Ollama containers
  Containerization   Docker
  Reverse proxy      Nginx
  CI/CD              GitHub Actions

These are roadmap choices, not claims that every deployment component is
already implemented.

## 14. Final Product Outcome

The intended final SecureTasks AI platform supports:

-   collaborative workspaces
-   project management
-   intelligent task systems
-   AI copilots
-   semantic knowledge retrieval
-   autonomous workflow generation
-   AI sprint planning
-   predictive analytics
-   realtime collaboration
-   local AI inference
-   agentic workflows
-   scalable SaaS infrastructure
-   distributed AI infrastructure

The project therefore serves two purposes simultaneously:

1.  A real engineering product.
2.  A structured learning system covering backend, frontend, SaaS, AI,
    ML infrastructure, agents, and distributed systems.
