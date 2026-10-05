# NEXIS SITTA - Development Guidelines

## Project Context
Building NEXIS SITTA, a B2B Multi-Tenant Inventory SaaS Platform.

## Core Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS + Shadcn/ui
- Supabase (PostgreSQL with Row Level Security)

## Coding Rules
1. Always use TypeScript with explicit types (no `any`).
2. Follow Next.js App Router conventions (separate Server and Client Components).
3. Ensure database interactions respect Supabase Row Level Security (RLS). Always bind `organization_id`.
4. Use clean, modular code with utility classes via `cn()` from `@/lib/utils`.