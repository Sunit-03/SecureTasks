# SecureTasks AI --- AI Layer Architecture & Engineering Documentation

## 1. Document Purpose

This document defines the complete planned AI layer for SecureTasks AI,
based on the project roadmap and system discussions.

The AI layer is intended to evolve progressively from local LLM
inference into retrieval systems, RAG, agentic workflows, predictive
intelligence, realtime AI, observability, and distributed AI deployment.

> **Important status note:** The uploaded project material describes
> this AI layer primarily as a roadmap/evolution plan. The presence of a
> component in this document means it is part of the intended
> architecture; it does not mean that component has already been
> implemented.

## 2. AI Layer Vision

The AI layer exists to transform SecureTasks from a collaborative
project-management application into an **AI-native engineering
operations platform**.

The AI system is intended to understand:

-   tasks
-   projects
-   workspaces
-   documentation
-   comments
-   architecture decisions
-   sprint state
-   dependencies
-   blockers
-   organizational knowledge

The long-term goal is not merely a chatbot. The AI layer should provide:

-   contextual assistance
-   task intelligence
-   semantic retrieval
-   organizational memory
-   workflow automation
-   agentic execution
-   operational prediction
-   realtime intelligence

## 3. High-Level AI Architecture

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

A more conceptual AI request flow is:

``` text
User / Application Event
        ↓
Backend API
        ↓
AI Orchestration
        ↓
Choose AI workflow
        ↓
Retrieve required context
        ↓
LLM / Agent execution
        ↓
Structured result
        ↓
Business validation
        ↓
Persist / return / trigger workflow
```

## 4. AI Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Intended Role
  ----------------------- ----------------------- -----------------------
  LLM runtime             Ollama                  Local model
                                                  hosting/inference

  Workflow orchestration  LangGraph               Stateful AI workflows
                                                  and agents

  AI framework            LangChain               AI application/tooling
                                                  abstraction

  Vector storage          pgvector                Semantic/vector
                                                  retrieval

  Embeddings              BGE / E5                Convert content into
                                                  vectors

  General models          Mistral / Qwen / Phi    Local inference

  AI observability        LangSmith               Tracing and evaluation

  Infrastructure          Redis                   Planned cache, queues,
                                                  pub/sub, workflow state

  Database                PostgreSQL              Source of truth +
                                                  pgvector

  Containers              Docker                  Planned AI
                                                  service/model
                                                  deployment
  -----------------------------------------------------------------------

## 5. Model Strategy

The documented model recommendations are:

  Purpose              Recommended Model
  -------------------- ---------------------
  General reasoning    Mistral 7B
  Coding workflows     Qwen2.5-Coder
  Lightweight tasks    Phi-3 Mini
  Advanced reasoning   DeepSeek R1 Distill

The architecture also calls for **model routing**, meaning the AI layer
should eventually select an appropriate model/workflow according to the
task rather than treating every request identically.

Examples:

``` text
Task breakdown
    → general reasoning model

Code-oriented analysis
    → coding model

Lightweight summarization
    → lightweight model

Complex multi-step reasoning
    → advanced reasoning model
```

The exact production model selection is intentionally left open in the
source roadmap.

## 6. AI Service Boundary

The AI layer is planned as an independent application/service boundary
rather than embedding every AI operation directly into Express
controllers.

Conceptually:

``` text
Express Backend
      ↓
AI Service / AI Orchestration
      ↓
Models + Retrieval + Workflows
```

This separation allows the core application to remain responsible for:

-   authentication
-   authorization
-   workspace isolation
-   business rules
-   persistence
-   API contracts

while the AI layer is responsible for:

-   inference
-   prompts
-   retrieval
-   workflow orchestration
-   tool execution
-   AI-specific state
-   evaluation and telemetry

## 7. Phase 7 --- AI Infrastructure Foundation

### Goal

Create the local AI infrastructure required for all later AI
capabilities.

### Planned components

-   Ollama setup
-   local model hosting
-   AI microservice
-   inference abstraction layer
-   model routing
-   prompt templates

### Learning outcomes

-   local inference
-   AI service architecture
-   model orchestration
-   inference APIs
-   prompt engineering

### Intended flow

``` text
Application
   ↓
AI API
   ↓
Inference Abstraction
   ↓
Model Router
   ↓
Ollama
   ↓
Selected Local Model
```

The inference abstraction is important because application code should
not need to know the implementation details of a particular model
runtime.

## 8. Phase 8 --- AI Task Intelligence

This is the first application-focused AI layer.

### Planned capabilities

-   AI task breakdown
-   acceptance criteria generation
-   task summaries
-   sprint summaries
-   prioritization suggestions
-   AI suggestions

### Example

Input:

``` text
Build websocket notifications
```

Potential structured output:

``` text
Backend
- notification event model
- notification API
- WebSocket event handling

Frontend
- notification UI
- realtime event listener

Testing
- backend event tests
- frontend realtime tests

Dependencies
- WebSocket infrastructure
- notification persistence
```

The roadmap specifically identifies structured outputs and
JSON/schema-oriented prompting as learning goals.

### Important architectural principle

AI-generated task data should be treated as **untrusted proposed data**
until the application validates it.

The intended architecture therefore becomes:

``` text
LLM
 ↓
Structured Output
 ↓
Schema Validation
 ↓
Business Validation
 ↓
Application Action
```

## 9. Prompt Architecture

The roadmap explicitly includes prompt templates and prompt engineering.

The AI layer should therefore organize prompts by capability rather than
scattering raw prompt strings throughout application code.

Conceptually:

``` text
prompts/
  task-breakdown/
  acceptance-criteria/
  task-summary/
  sprint-summary/
  prioritization/
  knowledge-assistant/
  sprint-planner/
```

Prompt versioning later becomes part of AI observability.

## 10. Phase 9 --- Embeddings & Semantic Search

### Goal

Add ML infrastructure that allows the system to search by meaning rather
than only by keywords.

### Planned capabilities

-   embedding generation
-   vector storage
-   semantic task search
-   similar-task detection
-   duplicate-task detection
-   contextual retrieval

### Technology

-   pgvector
-   BGE / E5 embeddings
-   PostgreSQL
-   retrieval pipelines

### Conceptual pipeline

``` text
Task / Document / Comment
        ↓
Embedding Model
        ↓
Vector
        ↓
pgvector
```

Query:

``` text
"tasks related to authentication bugs"
```

is transformed into a query embedding:

``` text
Query
 ↓
Embedding
 ↓
Vector similarity search
 ↓
Relevant records
```

This differs from simple keyword matching because retrieval is based on
semantic similarity.

## 11. Vector Data Model

The planned vector layer is attached to PostgreSQL through pgvector.

Conceptually, searchable content can include:

-   tasks
-   task descriptions
-   comments
-   documentation
-   architecture decisions
-   project information

Each indexed item should retain enough metadata to enforce
workspace/project authorization during retrieval.

A critical architectural boundary is:

``` text
User asks question
      ↓
Determine workspace
      ↓
Retrieve only authorized workspace data
      ↓
Semantic ranking
      ↓
Build AI context
```

The AI must not bypass the application's multi-tenant authorization
model merely because the data is stored in a vector index.

## 12. Phase 10 --- RAG Knowledge System

### Goal

Create an organizational-memory system that can answer questions using
project and workspace knowledge.

### Planned capabilities

-   workspace knowledge assistant
-   documentation retrieval
-   project context retrieval
-   organizational memory
-   context injection

### Example

Question:

``` text
How are refresh tokens implemented?
```

The system retrieves relevant:

-   tasks
-   documentation
-   comments
-   architecture decisions

and provides those items as context to the LLM.

### RAG pipeline

``` text
User Question
      ↓
Query Embedding
      ↓
Vector Retrieval
      ↓
Relevant Knowledge
      ↓
Authorization Filtering
      ↓
Context Assembly
      ↓
LLM
      ↓
Grounded Answer
```

### RAG learning outcomes

-   chunking
-   retrieval pipelines
-   context injection
-   grounding
-   hallucination reduction

## 13. Knowledge Ingestion Pipeline

The planned knowledge system implies an ingestion process:

``` text
Source Content
      ↓
Extract / Normalize
      ↓
Chunk
      ↓
Generate Embeddings
      ↓
Store Vector + Metadata
      ↓
Ready for Retrieval
```

Possible source types from the documented product direction include:

-   tasks
-   project data
-   comments
-   documentation
-   architecture decisions

The source material does not prescribe a specific chunking algorithm or
metadata schema, so those remain implementation decisions.

## 14. Workspace-Aware RAG

Multi-tenancy is a first-class architectural concern.

The AI layer must respect:

``` text
Workspace A
    ≠
Workspace B
```

Therefore retrieval should conceptually apply:

``` text
tenant/workspace authorization
        ↓
retrieval
        ↓
ranking
        ↓
context construction
```

rather than retrieving globally and attempting to hide unauthorized
results later.

This keeps the AI layer aligned with the existing SaaS authorization
architecture.

## 15. AI Response Caching with Redis

Redis is planned as a performance layer for expensive or repeated AI
operations.

Example:

``` text
User asks:
"Summarize sprint progress"

        ↓

Check Redis
        ↓
Cache hit → return cached response

Cache miss
        ↓
Run AI workflow
        ↓
Store response
        ↓
Return result
```

A documented example is a cache key such as:

``` text
ai:sprint-summary:workspace-123
```

The broader Redis plan also includes caching workspace, dashboard, and
task data.

## 16. AI Background Jobs

AI operations such as embeddings generation and heavier AI workflows may
become asynchronous.

Planned architecture:

``` text
Backend API
     ↓
Redis Queue
     ↓
Worker
     ↓
AI Processing
     ↓
PostgreSQL / pgvector
```

Planned queue use cases include:

-   AI jobs
-   embedding generation
-   notifications
-   email
-   asynchronous summarization

BullMQ is the documented queue technology for Redis-backed jobs.

This prevents expensive AI work from unnecessarily blocking normal HTTP
requests.

## 17. Phase 11 --- LangGraph Agent Workflows

### Goal

Move from isolated prompts to stateful, multi-step AI workflows.

### Planned capabilities

-   AI sprint planner
-   dependency analyzer
-   blocker detection
-   autonomous workflow chains
-   tool-calling agents

### Example workflow

``` text
Feature Request
      ↓
Analyze
      ↓
Break Into Tasks
      ↓
Estimate Complexity
      ↓
Assign Labels
      ↓
Create Tasks Automatically
```

LangGraph is the planned workflow technology.

## 18. Agent Architecture

The agent should be understood as a controlled workflow rather than an
unrestricted chatbot.

Conceptually:

``` text
Input
 ↓
Planner
 ↓
Analysis
 ↓
Tool Selection
 ↓
Tool Execution
 ↓
Validation
 ↓
Next Workflow State
 ↓
Final Result
```

Possible tools can eventually interact with the application's domain:

``` text
get tasks
get project
get sprint
search knowledge
create task
update task
add labels
inspect dependencies
```

The source roadmap explicitly identifies tool calling, stateful
workflows, workflow graphs, and durable AI systems as learning goals.

## 19. Agent State

The planned architecture introduces temporary workflow state for
multi-step AI processes.

Redis is identified as a possible location for temporary AI workflow
state.

Example:

``` text
workflowId
currentStep
input
intermediateResults
pendingToolCall
status
```

The exact persistence strategy is not fixed by the source material.

## 20. AI Tool Safety

Because agents can eventually create or modify application resources,
the AI layer should preserve the backend's existing authorization model.

The intended conceptual boundary is:

``` text
Agent
  ↓
Tool
  ↓
Backend authorization
  ↓
Business rules
  ↓
Database
```

The agent should not directly bypass application services and write
arbitrary database state.

This follows the project's existing separation-of-concerns and
authorization architecture.

## 21. Phase 12 --- Predictive Intelligence

### Goal

Add operational intelligence over project-management data.

### Planned capabilities

-   sprint risk prediction
-   blocker prediction
-   workload analysis
-   task completion estimation
-   anomaly detection
-   delay prediction

### Example

The roadmap gives the conceptual output:

``` text
This sprint is likely delayed because backend auth tasks are blocked.
```

### Learning outcomes

-   operational ML
-   scoring systems
-   classification logic
-   hybrid AI systems

The source material does not specify a final ML algorithm, training
dataset, or model architecture. Those remain future design decisions.

## 22. Hybrid Intelligence Model

The roadmap explicitly points toward combining heuristics and AI.

A future architecture can therefore combine:

``` text
Structured project metrics
        +
Rule/score systems
        +
LLM reasoning
        +
Historical data
        ↓
Operational intelligence
```

This is preferable to assuming that an LLM alone should perform every
predictive task.

## 23. Phase 13 --- Realtime AI Collaboration

### Planned capabilities

-   live task updates
-   realtime notifications
-   AI streaming responses
-   WebSocket collaboration
-   live sprint intelligence
-   collaborative AI assistants

### Technology direction

-   WebSockets
-   Socket.IO
-   streaming inference
-   event-driven architecture
-   Redis Pub/Sub

Conceptual flow:

``` text
User / System Event
        ↓
Redis Pub/Sub / Event Layer
        ↓
Realtime Server
        ↓
Connected Clients
```

AI responses can also be streamed:

``` text
LLM
 ↓
Streaming Inference
 ↓
AI Service
 ↓
WebSocket / streaming channel
 ↓
Next.js UI
```

## 24. Phase 14 --- AI Observability & Evaluation

Production AI requires more than application logs.

Planned capabilities:

-   prompt versioning
-   AI tracing
-   evaluation pipelines
-   hallucination monitoring
-   token monitoring
-   latency analytics

### Technology

LangSmith is the documented AI observability direction.

### Observability flow

``` text
AI Request
   ↓
Trace
   ├── Prompt version
   ├── Model
   ├── Retrieval
   ├── Tool calls
   ├── Latency
   ├── Token usage
   └── Output
```

## 25. AI Evaluation

The roadmap explicitly includes evaluation pipelines.

The intended purpose is to measure whether AI behavior is improving
rather than judging the system only by whether requests technically
succeed.

Potential evaluation dimensions supported by the documented goals
include:

-   answer quality
-   retrieval relevance
-   hallucination behavior
-   latency
-   token usage
-   workflow correctness

The source does not define a fixed evaluation dataset or scoring rubric
yet.

## 26. Prompt Versioning

Prompt templates should become versioned artifacts.

Conceptually:

``` text
task-breakdown
  v1
  v2
  v3
```

An AI trace should be able to associate a result with the prompt/model
configuration that produced it.

This enables:

``` text
Prompt change
    ↓
Evaluation
    ↓
Compare results
    ↓
Promote better version
```

## 27. AI Observability Metrics

The documented roadmap specifically calls out:

-   token monitoring
-   latency analytics
-   tracing
-   hallucination monitoring
-   evaluation pipelines

These should eventually allow questions such as:

``` text
Which workflow is slow?
Which model is expensive?
Which prompt version performs better?
Which retrieval pipeline produces poor context?
Which AI feature has high failure rates?
```

## 28. Phase 15 --- Distributed AI Deployment

### Goal

Move the AI platform toward production-oriented distributed
infrastructure.

The documented deployment direction is:

  Service         Deployment
  --------------- -------------------
  Frontend        Vercel
  Backend API     Railway / Render
  AI Service      GPU VPS
  PostgreSQL      Supabase / Neon
  Vector search   pgvector
  Models          Ollama containers

Additional infrastructure direction includes:

-   Docker
-   Nginx
-   GitHub Actions
-   service orchestration
-   GPU deployment
-   inference scaling

## 29. Why the AI Layer Is Separate

The project's AI architecture intentionally introduces a distinct AI
orchestration layer because AI workloads differ from ordinary CRUD
workloads.

Normal request:

``` text
Request
 ↓
Business logic
 ↓
Database
 ↓
Response
```

AI request:

``` text
Request
 ↓
Context selection
 ↓
Retrieval
 ↓
Prompt construction
 ↓
Model inference
 ↓
Potential tool calls
 ↓
Validation
 ↓
Response
```

Separating these concerns keeps the core application maintainable.

## 30. Complete AI Capability Map

### AI Assistance

-   AI chat assistant
-   task suggestions
-   sprint insights
-   workflow generation

### Task Intelligence

-   task breakdown
-   acceptance criteria
-   summaries
-   prioritization
-   dependency analysis

### Retrieval

-   semantic search
-   similar-task detection
-   duplicate detection
-   contextual retrieval

### Organizational Memory

-   workspace knowledge assistant
-   documentation retrieval
-   project-aware context
-   architecture-decision retrieval

### Agents

-   sprint planner
-   dependency analyzer
-   blocker detector
-   autonomous workflows
-   tool calling

### Predictive Intelligence

-   sprint risk
-   workload analysis
-   delay prediction
-   completion estimation
-   anomaly detection

### Realtime AI

-   streaming responses
-   live sprint intelligence
-   collaborative assistants
-   AI notifications

### AI Operations

-   prompt versioning
-   tracing
-   evaluation
-   hallucination monitoring
-   token monitoring
-   latency analytics

## 31. End-to-End Example --- AI Sprint Planner

A future sprint-planning request can conceptually follow:

``` text
User asks AI to plan a sprint
        ↓
Backend authenticates user
        ↓
Workspace authorization
        ↓
AI orchestration layer
        ↓
Retrieve relevant tasks/projects
        ↓
Retrieve organizational knowledge
        ↓
Build context
        ↓
LangGraph workflow
        ↓
Model inference through Ollama
        ↓
Generate structured sprint plan
        ↓
Validate output
        ↓
Optional tool calls
        ↓
Create/update tasks through backend services
        ↓
Persist results
        ↓
Stream/return result to frontend
        ↓
Trace and evaluate execution
```

## 32. End-to-End Example --- Knowledge Assistant

``` text
Question
"How are refresh tokens implemented?"
        ↓
Workspace identification
        ↓
Query embedding
        ↓
pgvector retrieval
        ↓
Retrieve docs/tasks/comments/architecture decisions
        ↓
Authorization filtering
        ↓
Context assembly
        ↓
LLM
        ↓
Grounded answer
        ↓
Trace + evaluation
```

## 33. End-to-End Example --- Automatic Task Breakdown

``` text
Feature request
        ↓
AI task-intelligence workflow
        ↓
Analyze feature
        ↓
Generate structured task plan
        ↓
Generate acceptance criteria
        ↓
Identify dependencies
        ↓
Validate JSON/schema
        ↓
Show proposed tasks
        ↓
Optional user approval
        ↓
Backend creates tasks
```

The project roadmap describes autonomous workflow generation, but the
exact approval policy is not fixed in the source material.

## 34. AI + Redis Architecture

The future architecture combines Redis with the AI system for
infrastructure concerns:

``` text
Redis
 ├── AI response cache
 ├── rate limiting
 ├── AI job queues
 ├── embedding jobs
 ├── notification jobs
 ├── Pub/Sub
 └── temporary agent/workflow state
```

This keeps ephemeral, fast-changing AI state separate from PostgreSQL's
durable source-of-truth role.

## 35. AI + PostgreSQL + pgvector

The intended data architecture is:

``` text
PostgreSQL
 ├── users
 ├── workspaces
 ├── projects
 ├── tasks
 ├── comments
 └── other application data

pgvector
 └── embeddings + retrieval metadata
```

The important architectural principle is that vector retrieval remains
connected to the application's tenant and authorization model.

## 36. AI Engineering Principles

The project direction implies the following principles:

### 1. AI is an application layer, not the entire application

The core backend remains responsible for identity, authorization,
business rules, and persistence.

### 2. Retrieval should be contextual

The AI should retrieve project/workspace-specific information rather
than blindly querying all organizational data.

### 3. AI outputs require validation

Structured output should pass through schema and business validation
before becoming application state.

### 4. Agents should use tools through application boundaries

Agent actions should pass through backend authorization and business
logic.

### 5. Expensive work should become asynchronous where appropriate

Queues and workers are planned for AI jobs and embedding generation.

### 6. AI behavior must be observable

Prompts, models, retrieval, latency, tokens, and outputs need
traceability.

### 7. The system should evolve incrementally

The roadmap deliberately progresses:

``` text
Inference
  ↓
Task Intelligence
  ↓
Embeddings
  ↓
RAG
  ↓
Agents
  ↓
Prediction
  ↓
Realtime AI
  ↓
AI Observability
  ↓
Distributed AI
```

## 37. AI Learning Outcomes

By completing the AI roadmap, the project is intended to teach:

-   local LLM inference
-   AI service architecture
-   prompt engineering
-   structured outputs
-   embeddings
-   vector similarity
-   retrieval systems
-   RAG
-   chunking
-   context injection
-   grounding
-   hallucination reduction
-   agent orchestration
-   state machines
-   workflow graphs
-   tool execution
-   operational ML
-   hybrid AI systems
-   streaming AI
-   pub/sub
-   AI observability
-   LLM evaluation
-   inference scaling
-   distributed AI infrastructure

## 38. Final AI Architecture

``` text
                         ┌─────────────────────┐
                         │    Next.js UI       │
                         │ Chat / AI Actions    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Backend API       │
                         │ Auth + RBAC + SaaS  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ AI Orchestration     │
                         │ Routing + Prompts    │
                         └──────┬───────┬──────┘
                                │       │
                    ┌───────────┘       └────────────┐
                    ▼                                ▼
             ┌─────────────┐                  ┌─────────────┐
             │ LangGraph   │                  │ Retrieval   │
             │ Workflows   │                  │ Pipeline    │
             └──────┬──────┘                  └──────┬──────┘
                    │                                │
                    ▼                                ▼
             ┌─────────────┐                  ┌─────────────┐
             │   Ollama    │                  │ PostgreSQL  │
             │ Local LLMs  │                  │ + pgvector  │
             └─────────────┘                  └─────────────┘
                    │                                ▲
                    │                                │
                    └──────────────┬─────────────────┘
                                   ▼
                            ┌─────────────┐
                            │   Redis     │
                            │ Cache/Jobs/ │
                            │ PubSub/State│
                            └─────────────┘
```

## 39. Final Outcome

The completed AI layer is intended to make SecureTasks AI capable of:

-   understanding project context
-   breaking down engineering work
-   generating acceptance criteria
-   summarizing sprints
-   searching organizational knowledge semantically
-   detecting similar or duplicate tasks
-   answering workspace-aware questions
-   planning sprints
-   analyzing dependencies
-   identifying blockers
-   predicting operational risk
-   streaming AI responses
-   orchestrating multi-step workflows
-   executing controlled tool calls
-   maintaining AI workflow state
-   measuring and evaluating AI behavior
-   running local models
-   scaling AI infrastructure toward distributed deployment

The key evolution is:

``` text
LLM Integration
      ↓
AI Features
      ↓
Retrieval
      ↓
RAG
      ↓
Agents
      ↓
Operational Intelligence
      ↓
Realtime AI
      ↓
Observable Production AI
      ↓
Distributed AI Platform
```
