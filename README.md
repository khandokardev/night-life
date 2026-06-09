# SA PLUG

Premium luxury nightlife and lifestyle app platform for South Africa — includes a mobile Expo app, a back-office Admin Panel, and a production-ready Express API.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000 via workflow, actually 8080 locally)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (provisioned, available as env var)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)
- Admin Panel: React + Vite + shadcn/ui + Tailwind (`artifacts/admin-panel`)
- Mobile: Expo SDK 54 + Expo Router (`artifacts/sa-plug-mobile`)

## Where things live

- `lib/db/src/schema/` — Drizzle ORM table definitions (users, content, bookings, social, payments, promotions)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all API endpoints)
- `lib/api-client-react/src/generated/` — generated React Query hooks (from codegen)
- `lib/api-zod/src/generated/` — generated Zod schemas (from codegen)
- `artifacts/api-server/src/routes/` — Express 5 route handlers
- `artifacts/admin-panel/src/` — Admin Panel frontend (React + Vite)
- `artifacts/sa-plug-mobile/` — Expo mobile app
- `sa-plug-backend.tar.gz` — standalone backend bundle for Hostinger deployment

## Architecture decisions

- Contract-first: OpenAPI spec → codegen → typed client hooks + server Zod schemas
- JWT auth (access + refresh tokens); admin routes require `role === "admin"`
- Admin Panel uses a custom Orval mutator (`artifacts/admin-panel/src/lib/mutator.ts`) that attaches `Authorization: Bearer <token>` from localStorage
- Standalone backend (`sa-plug-backend.tar.gz`) is for Hostinger Node.js hosting; monorepo `api-server` is the local dev copy
- Drizzle ORM with `drizzle-kit push` for schema migrations (dev); no drizzle-zod in standalone backend

## Product

- **Mobile App**: Browse clubs, restaurants, tours, events, products; make bookings; view QR codes; manage profile; chat with support; receive notifications; view promotions
- **Admin Panel**: Full back-office for managing all content (clubs, restaurants, tours, products, events, categories), users, bookings, reviews, notifications, promotions, app settings, and chat support
- **API**: JWT auth, CRUD for all entities, analytics endpoint, Stripe payment intents, Socket.io chat

## Content types

- **Categories**: icon, name, order, active
- **Clubs**: nightclub listings with dress code, opening hours, min spend
- **Restaurants**: cuisine, reservation required, opening hours, dress code
- **Tours**: duration, includes, max group size, meeting point
- **Products**: SKU, stock, brand, sizes, colours
- **Events**: date, time, venue, dress code, lineup, ticket URL

## API Route Structure

All routes under `/api`:
- `GET /healthz`
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `GET /content/categories`, `/content/clubs`, `/content/restaurants`, `/content/tours`, `/content/products`, `/content/events`
- `GET|POST /bookings`, `GET|DELETE /bookings/:id`
- `GET|PATCH /users/me`
- `GET|POST /reviews`, `GET|DELETE /reviews/:id`
- `GET|PATCH /notifications`, `POST /notifications/:id/read`
- `GET|POST /chat`
- `GET /promotions`
- `POST /payments/create-intent`
- Admin routes (`GET /admin/analytics`, full CRUD for all entities, `GET /admin/users`, etc.)

## Admin Panel Pages

- `/login` — JWT login
- `/dashboard` — analytics (users, bookings, reviews, promotions)
- `/users` — manage users + roles
- `/categories`, `/clubs`, `/restaurants`, `/tours`, `/products`, `/events` — full CRUD
- `/bookings` — approve / cancel
- `/reviews` — approve / reject moderation queue
- `/notifications` — broadcast notifications
- `/promotions` — manage banners/campaigns
- `/settings` — key/value app settings
- `/chat` — support inbox with admin reply

## Standalone Backend (Hostinger)

Bundle at `sa-plug-backend.tar.gz`. Hostinger config:
- Framework: Express
- Node: 22.x
- Entry: `dist/index.js`
- Build command: `node_modules/.bin/tsc`
- Start command: `node dist/index.js`
- **Important**: All `@types/*` must be in `dependencies` (not devDependencies) for Hostinger builds

## User preferences

- Gold accent color: #D4AF37 (HSL 43 74% 49%)
- Fonts: Poppins / Inter
- Dark-first admin panel
- SA (South Africa) market — ZAR currency

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after every OpenAPI spec change
- Do not use `pnpm dev` at workspace root — use workflow restarts
- `lib/db` uses `drizzle-zod` but standalone backend uses manual Zod schemas (no drizzle-zod)
- Stripe v17 in standalone backend: `new Stripe(STRIPE_SECRET)` with no `apiVersion` field
- Admin Panel hooks import from `@workspace/api-client-react`; mutator at `src/lib/mutator.ts`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
