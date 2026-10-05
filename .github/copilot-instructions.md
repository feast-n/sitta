# NEXIS SITTA - Development Guidelines & Progress Context

## Project Overview
NEXIS SITTA is a B2B Multi-Tenant Inventory & ERP Core SaaS Platform built on top of Next.js App Router and Supabase, enforcing zero-trust data isolation per organization via Row Level Security (RLS).

---

## Core Tech Stack
- **Framework:** Next.js (App Router, React 19 / Modern, TypeScript)
- **Styling & UI:** Tailwind CSS, Shadcn/ui, `clsx`, `tailwind-merge`
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security / RLS), `@supabase/ssr`, `@supabase/supabase-js`

---

## Architecture & Database Schema
Multi-tenancy is handled at the SQL level using `organization_id` bound to every tenant-specific record.

### Active Tables & Schema
1. `public.organizations` (`id`, `name`, `slug`, `created_at`)
2. `public.profiles` (`id` references `auth.users`, `organization_id`, `full_name`, `role` ['admin', 'staff'], `created_at`)
3. `public.products` (`id`, `organization_id`, `name`, `sku`, `stock`, `price`, `created_at`)

### Security Model
- RLS enabled on all business tables.
- RLS policy utilizes helper function `public.get_user_org_id()` to enforce strict tenant isolation.

---

## Critical Directory & Utility Structure
- `src/middleware.ts` — Edge middleware for session refresh & route protection (`/dashboard`, `/products`).
- `src/lib/supabase/client.ts` — Client-side Supabase browser helper (`createBrowserClient`).
- `src/lib/supabase/server.ts` — Server-side Supabase helper (`createServerClient` for Server Components & Actions).
- `src/lib/auth/actions.ts` — Auth Server Actions (`signInAction`, `signUpAction`, `signOutAction`).
- `src/hooks/use-user-profile.ts` — Custom hook for user profile and active tenant context.
- `src/lib/utils.ts` — Utility class merger (`cn()`).

---

## Coding Rules & Standards
1. **Strict Typing:** Always use explicit TypeScript types or interfaces. Strict prohibition of `any`.
2. **App Router Conventions:** Maintain clear separation between Client Components (`'use client'`) and Server Components/Actions.
3. **Multi-Tenant Safety:** All mutations (INSERT/UPDATE) must implicitly or explicitly respect `organization_id` boundary via RLS context.
4. **Clean UI:** Use Shadcn/ui components structured with utility helper `cn()` from `@/lib/utils`.
5. **Cookie Handling:** Auth state and session management must strictly go through `@supabase/ssr` cookies.

---

## Progress Tracker

### Completed Tasks
- [x] Next.js initialization & base dependencies setup (`@supabase/ssr`, Tailwind, Shadcn).
- [x] App layout for `(dashboard)` group including Sidebar & Navbar.
- [x] Base Dashboard landing page (`/dashboard`).
- [x] Client-side Product CRUD page (`/products`).
- [x] Edge Middleware for protected routes (`src/middleware.ts`).
- [x] Supabase Auth Server Actions for multi-tenant register & login (`src/lib/auth/actions.ts`).

### Current Focus / Immediate Next Steps
- [ ] Implement Role-Based Access Control (RBAC) helpers to restrict actions (e.g., product deletion) to `admin` role only.
- [ ] Integration testing for RLS multi-tenant data isolation.
- [ ] Add toast notifications / error feedback on auth & product forms.

---

## Known Constraints & Notes
- Every new user registration (`signUpAction`) automatically creates a new tenant entry in `organizations` and assigns the registering user as `admin` in `profiles`.