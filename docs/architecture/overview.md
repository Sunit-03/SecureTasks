# SecureTasks Architecture

## Overview

SecureTasks is a production-style full-stack application built to learn modern software engineering concepts.

## Tech Stack

### Frontend
- Next.js
- TypeScript

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- PostgreSQL

## Core Concepts

- JWT Authentication
- Refresh Tokens
- Middleware Architecture
- Repository Pattern
- Service Layer
- RBAC
- API Documentation
- Database Relationships

## High-Level Request Flow

Client
→ Middleware
→ Controller
→ Service
→ Repository
→ Prisma
→ PostgreSQL