# MarketPay Super App — Frontend UI

A complete **UI-only** Next.js 14 implementation of the MarketPay Super App experience described in the supplied April 2026 MarketPay user stories, architecture diagrams and developer toolkit.

This repository intentionally contains **no backend implementation, no real payment calls, no KYC provider calls and no privileged infrastructure operations**. Interactions use deterministic mock data and local UI state so the full product surface can be reviewed, tested and integrated later against the Django API Gateway / MarketPay services.

## Frontend scope implemented

The UI is organised by persona rather than one oversized dashboard:

- **Authentication & identity** — login, role preview, registration, OTP, password policy, role-specific KYC upload, password reset and MFA.
- **Consumer** — marketplace search/filter/sort, out-of-stock treatment, AI cheaper-alternative cues, nutrition, cart, checkout, wallet/M-Pesa payment selection, escrow explanation, order tracking, confirmation, disputes, receipts, wallet history, price intelligence, alerts, profile/security and notification preferences.
- **Retailer / vendor** — overview, product listing creation, AI pricing comparison, inventory/low-stock state, order management, analytics, storefront configuration and CSV import validation.
- **Wholesaler** — bulk deals, minimum-order controls, group buys, bulk orders/sub-shipments and volume analytics.
- **Rider** — availability, assignment offer UI, active delivery route, OTP completion, settlement history, earnings, performance and rider/vehicle/KYC profile.
- **Government analyst** — read-only food-security overview, market price monitor, heatmap, shortage alerts, root-cause review, acknowledgement/escalation and report generation/export UI.
- **Admin / DevOps** — user management, KYC review, disputes, fraud/risk, data-pipeline adapters and quarantine, service monitoring, deployment status, backup/DR readiness, platform configuration and audit log.
- **Offline / low-connectivity** — PWA/offline-state preview, USSD `*384#` menu preview, SMS price lookup and low-bandwidth controls.
- **Notifications** — global notification drawer with order, wallet, price and security event examples.

## Architecture

```text
app/                         Next.js App Router routes
  login/                     Auth entry points
  register/
  forgot-password/
  mfa/
  offline/
  consumer/                  Consumer routes
  vendor/                    Retailer routes
  wholesaler/                Wholesaler routes
  rider/                     Rider routes
  government/                Government analyst routes
  admin/                     Admin / operations routes

components/
  auth/                      Shared authentication presentation
  layout/                    Role-aware application shell
  providers/                 Client-side demo state
  shared/                    Reusable domain-neutral presentation
  ui/                        Small design-system primitives
  workspaces/                Persona-focused feature compositions

lib/
  mock-data.ts               UI fixture data (single replacement point)
  navigation.ts              Role navigation model
  types.ts                   Shared frontend domain types
  utils.ts                   Formatting and UI helpers
```

The design follows a few maintainability rules:

1. **Routes are thin.** Route files only select a role and section.
2. **Persona workspaces own feature composition.** This prevents consumer, merchant, rider and operator requirements from becoming one monolithic component.
3. **Reusable UI primitives are small.** Cards, badges, modals, toggles, metrics, status handling and section headers are shared.
4. **Mock data is isolated.** Replace `lib/mock-data.ts` (or introduce typed query hooks beside it) when API integration begins; the page structure does not need to be redesigned.
5. **Role-aware navigation is declarative.** Add or remove workspace capabilities in `lib/navigation.ts` rather than duplicating shell logic.
6. **Sensitive/privileged operations are represented, not faked as real integrations.** The UI makes the intended workflows reviewable without pretending to call M-Pesa, KYC, Kafka, Prometheus, backup systems or admin APIs.

## Technology

- Next.js 14 App Router
- React 18
- TypeScript in strict mode
- Tailwind CSS 3
- Lucide icons
- No extra component framework or state library required

The supplied developer toolkit specifies Node.js 20 LTS and `pnpm`; use that combination for the closest project alignment.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`. The root route redirects to `/login`.

Useful commands:

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Demo entry points

| Persona | Route |
|---|---|
| Login / role launcher | `/login` |
| Registration | `/register` |
| MFA | `/mfa` |
| Consumer | `/consumer` |
| Retailer | `/vendor` |
| Wholesaler | `/wholesaler` |
| Rider | `/rider` |
| Government analyst | `/government` |
| Admin / DevOps | `/admin` |
| Offline / USSD preview | `/offline` |

The login screen includes workspace buttons so every persona can be reviewed without backend credentials.

## Integration handoff

When backend integration starts, keep the UI components and add a typed data layer (for example `lib/api/*` + feature hooks). Replace the following demo behaviours with real contracts:

- authentication/JWT/refresh token lifecycle and RBAC routing;
- OTP and MFA challenge verification;
- KYC document upload/review;
- wallet balance, STK Push, P2P, withdrawal and escrow actions;
- marketplace search, inventory and order lifecycle;
- rider assignment/GPS/ETA updates;
- AI pricing, forecasts and shortage signals;
- notification delivery/preferences;
- government reporting data;
- admin monitoring/configuration/audit/backup operations.

Do not move payment, authorization, fraud, KYC or access-control decisions into the browser. The UI should display server decisions and submit user intent; security and financial invariants remain server-side.

## Notes on this deliverable

- All visible amounts, names, statuses, charts and maps are demo fixtures.
- The route/map visualization is purpose-built UI and does not depend on a map provider.
- Product images are intentionally represented with lightweight graphical placeholders to keep the codebase self-contained.
- No secrets or `.env` credentials are included.
- `.env.example` contains only a future API base URL placeholder.
