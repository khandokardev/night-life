---
name: SA PLUG Admin Panel
description: React+Vite admin panel for SA PLUG — pages, auth flow, custom Orval mutator, and key integration patterns.
---

## Artifact
- Dir: `artifacts/admin-panel`
- Port: 20130, previewPath: `/admin-panel/`
- Dark-first, gold accent (HSL 43 74% 49%), Tailwind + shadcn/ui

## Auth
- JWT stored in `localStorage` as `saPlugAdminToken`
- Custom Orval mutator at `artifacts/admin-panel/src/lib/mutator.ts` — attaches `Authorization: Bearer` header; redirects to `/login` on 401
- `useAuth` hook from `hooks/use-auth.tsx` — AuthProvider wraps entire app
- `ProtectedRoute` component in App.tsx checks `isAuthenticated`; renders `<Redirect to="/login" />` if not

## Orval mutator config
`lib/api-spec/orval.config.ts` → `api-client-react` output → `override.mutator` points to `artifacts/admin-panel/src/lib/mutator.ts`, `name: "customInstance"`.
Re-run codegen after any orval.config change: `pnpm --filter @workspace/api-spec run codegen`

## Pages
`/login`, `/dashboard`, `/users`, `/categories`, `/clubs`, `/restaurants`, `/tours`, `/products`, `/events`, `/bookings`, `/reviews`, `/notifications`, `/promotions`, `/settings`, `/chat`

## Key fix
Hooks must NOT be called inside anonymous render functions passed to `<Route>`. Use named components for all routes. `<Redirect to="..." />` from wouter handles redirects, not `useEffect + setLocation`.

## Analytics endpoint
`GET /api/admin/analytics` — added to `artifacts/api-server/src/routes/admin.ts` using drizzle `count()` across 7 tables in a single `Promise.all`.

**Why:** The route wasn't in the original admin.ts; it was added when writing the OpenAPI spec for the admin panel.
