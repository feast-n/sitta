# NEXIS SITTA - Development Guidelines & Progress Context

## Project Overview
NEXIS SITTA is a B2B Multi-Tenant Inventory & ERP Core SaaS Platform built on Next.js App Router and Supabase, enforcing zero-trust data isolation per organization via Row Level Security (RLS).

> **This file must stay honest.** Do not tick a task as done unless the code is committed and verified. An earlier version of this file claimed files existed that were never written.

---

## Core Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling & UI:** Tailwind CSS v4, `clsx`, `tailwind-merge`. Shadcn/ui is **not** installed.
- **Database & Auth:** Supabase (PostgreSQL with RLS), `@supabase/ssr`, `@supabase/supabase-js`

---

## Architecture & Database Schema
Multi-tenancy is handled at the SQL level using `organization_id` bound to every tenant-specific record.

### Active Tables & Schema
1. `public.organizations` (`id`, `name`, `slug`, `created_at`)
2. `public.profiles` (`id` references `auth.users`, `organization_id`, `full_name`, `role` ['admin', 'staff'], `created_at`)
3. `public.products` (`id`, `organization_id`, `name`, `sku`, `stock`, `price`, `created_at`)

### Security Model
- RLS enabled on all business tables. Verified: anon `INSERT` into `organizations` returns `42501`.
- RLS policies use helper function `public.get_user_org_id()` for tenant scoping.
- `organization_id` is **never** accepted from client input. It is bound from
  the server-side session via `getSessionContext()`.

---

## Critical Directory & Utility Structure
- `src/proxy.ts` — Next.js 16 renamed `middleware.ts` to `proxy.ts` (middleware is deprecated). Refreshes the session cookie and guards `/dashboard`, `/products`, `/settings`, `/stock-logs`.
- `src/lib/supabase/proxy.ts` — `updateSession()` helper. Uses `auth.getClaims()`, which returns `{ claims, header, signature }` — **not** `{ user }`.
- `src/lib/supabase/client.ts` — browser client helper.
- `src/lib/supabase/server.ts` — server client helper (Server Components & Actions).
- `src/lib/auth/actions.ts` — `signInAction`, `signUpAction`, `signOutAction`.
- `src/lib/auth/session.ts` — `getSessionContext()` resolves user + tenant + role.
- `src/lib/auth/types.ts`, `src/lib/products/types.ts` — shared types/state (see rule 5 below).
- `src/lib/products/actions.ts` — `createProductAction`, `deleteProductAction` (RBAC: admin only).
- `supabase/migrations/` — plain SQL, applied via the Supabase SQL Editor.

---

## Coding Rules & Standards
1. **Strict Typing:** explicit TypeScript types, no `any`.
2. **App Router Conventions:** clear separation of Client vs Server Components. Fetch in Server Components, mutate via Server Actions.
3. **Multi-Tenant Safety:** mutations bind `organization_id` from the session. RLS is the real boundary.
4. **Clean UI:** Tailwind utility classes with `cn()` from `@/lib/utils`.
5. **Cookie Handling:** auth state goes strictly through `@supabase/ssr`.
6. **`'use server'` exports:** a `'use server'` module may only export async functions. Exporting a plain object (e.g. `initialAuthState`) throws at runtime. Put those in a separate module.

---

## Progress Tracker

### Completed Tasks
- [x] Next.js initialization & base dependencies (`@supabase/ssr`, Tailwind v4).
- [x] App layout for `(dashboard)` group including Sidebar & Navbar.
- [x] Dashboard landing page (`/dashboard`) with real aggregate stats.
- [x] Products page (`/products`) as a Server Component with Server Action mutations.
- [x] `src/proxy.ts` — Next 16 route protection & session refresh.
- [x] Auth Server Actions + `/login` and `/register` pages.
- [x] `getSessionContext()` — user + tenant + role resolution.
- [x] RBAC: product deletion restricted to `admin`.
- [x] Migration `0001_tenant_bootstrap.sql` (auto-creates org + admin profile on signup).

### Current Focus / Immediate Next Steps
- [ ] End-to-end verification: register -> confirm email -> login -> create product.
- [ ] Verify RLS tenant isolation with two accounts (Org A must not see Org B's products).
- [ ] Add automated tests for the RLS isolation boundary.
- [ ] Stock transaction ledger (`/stock-logs`) and organization settings (`/settings`) — currently unbuilt and removed from the sidebar to avoid 404s.

---

## Known Constraints & Notes
- A new registration (`signUpAction`) triggers `handle_new_user()`, which creates the `organizations` row and a `profiles` row with `role = 'admin'`.
- Email confirmation is enabled on the Supabase project by default, so a new user must confirm before the session is issued.
- The `use server` rule (6) and the `getClaims()` return shape have both caused real runtime bugs; verify against the installed SDK version rather than older docs.