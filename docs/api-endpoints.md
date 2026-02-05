# API Endpoints Audit

This document lists every route under `app/api/`, its HTTP method(s), and whether it is **Protected** (requires an authenticated session) or **Public** (and why).

**Note:** Middleware does not run for `/api/*`. Protection is implemented per-route inside each handler (e.g. via `requireApiAuth()` or `getServerSession()`). When adding a new API route, update this doc and ensure protected routes call the auth helper.

| Endpoint | Methods | Protection | Reason |
|----------|---------|------------|--------|
| `/api/auth/[...nextauth]` | GET, POST | Public | Auth provider; handles login, signout, and callbacks. |
| `/api/health` | GET | Public | Health check for load balancers/monitoring. |
| `/api/resume-pdf` | POST | **Protected** | Returns PDF for user content; requires session. |
| `/api/signup` | POST | Public | User registration; must be unauthenticated. |

## Policy

- **Protected:** Any API that reads or mutates user-specific or sensitive data must require an authenticated user and return 401 when unauthenticated.
- **Public:** Auth-related routes (`/api/auth/*`, `/api/signup`) and the health endpoint (`/api/health`) are intentionally public.

## Server actions (create / import)

These are server actions (form/post handlers), not API routes. Both are **protected**: they call `getServerSession(authOptions)` and `redirect("/login")` when unauthenticated.

| Action | File | Protection | Notes |
|--------|------|------------|--------|
| `createTailoredResume` | `app/create/actions.ts` | **Protected** | Creates a tailored resume; uses session `user.id`, redirects if no session. |
| `importFromResume` | `app/settings/actions.ts` | **Protected** | Imports profile from pasted resume text; uses session, redirects if no session. |

`updateSettings` and `updateTailoredDocument` (and other actions in `app/settings/actions.ts`, `app/history/[id]/actions.ts`) also check session and redirect when unauthenticated.

## Checklist for new endpoints

1. Add the route to the table above (or the server actions table if it’s a server action).
2. If it handles user/sensitive data: use `requireApiAuth()` (API routes) or `getServerSession` + `redirect("/login")` (server actions) at the top of the handler.
3. If it is intentionally public: note the reason in the table.
4. For API routes only: add or update tests in `lib/api-protection.test.ts` (protected routes must return 401 when unauthenticated).
