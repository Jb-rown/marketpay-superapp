# MarketPay UI — expanded interface delivery

## Source and implementation approach

This package extends the supplied `frontend.zip` / enhanced baseline using the MarketPay Function Specification, the 92 user stories / 14 epics, architecture diagrams, API reference, the implementation scope matrix and the official theme colour guide. Existing Next.js 14 routes, layouts, six role workspaces, and shared UI components are preserved. The scope is **frontend/UI only**, not implementation of real payment, wallet ledger, escrow, backend role enforcement, MFA, KYC, data ingestion, SMS, or AI services.

## Screens already in the baseline

Authentication: login, registration, MFA, forgot password. Consumer: marketplace, shopping planner, cart/checkout, orders, wallet, intelligence, profile. Vendor: dashboard, products, inventory, orders, analytics, storefront, CSV import. Wholesaler: dashboard, deals, group buys, bulk orders, analytics. Rider: dashboard, assignments, active delivery, earnings, performance, profile. Government: overview, prices, heatmap, alerts, reports. Admin: overview, users, KYC, disputes, fraud, data pipeline, monitoring, backups, configuration, audit. Shared offline-access screen.

## New interactive route coverage

- `/consumer/group-buys`: view pool progress, join available group deals with quantity/price validation, review/cancel browser-persisted demo pledges.
- `/consumer/price-alerts`: create, filter, pause/resume and remove food price-watch rules, compare targets against catalogue samples; browser-persisted.
- `/vendor/settlements`: merchant settlement ledger preview, status filtering and CSV export; no live settlement.
- `/wholesaler/shipments`: create tracked sub-shipments, filter them, advance valid fulfilment stages and export CSV; browser-persisted.
- `/rider/history`: completed/cancelled delivery history, filtering and CSV export.
- `/government/regions`: commodity/market comparison, adjustable threshold, watch classification and CSV export.
- `/admin/notifications`: create communication drafts, mark ready/reopen, delete; browser-persisted. Never transmits messages.

## Existing screen enhancements

- `/vendor/products`: create draft listings with required name, valid price and non-negative stock. New drafts are added to the displayed table in the current UI session, not published.
- `/vendor/orders`: accept/reject new orders, progress preparing orders to rider pickup, inspect fulfilment summary. Changes are current-session UI state only.
- Theme: aligned primary navy `#1B3A6B`, action blue `#2563EB`, surface `#F0F4FF`, background `#FAFAF9`, success/food green `#16A34A`, amber `#D97706`, crimson `#DC2626`, and foreground `#111827` through CSS custom properties and Tailwind palette.
- Preserves prior consumer planner and cart hydration fix.

## Integration architecture

`components/workspaces/extended.tsx` contains reusable UI-level interactions and reusable `useDemoRecords` state for this iteration; all navigation and metadata are routed through the existing `lib/navigation.ts` and `components/workspaces/workspace.tsx`. New thin route pages live in `app/<role>/<section>/page.tsx`. All new icons use `lucide-react`; no new dependency is required.

## Validation performed / remaining

- All TypeScript and TSX files passed TypeScript parser syntax checks (82 files); complete type-check and production build **not verified**.
- Attempted `npm ci`; installation timed out and left incomplete dependencies in the working directory. `node_modules` is **excluded** from this package.
- `npm run typecheck` could not run to completion because type declarations were unavailable and global TypeScript version differs from the lockfile. Run `npm ci && npm run typecheck && npm run build` on a development machine with package registry access before use. Application is not certified error-free.
- Remaining gaps: many legacy baseline mock actions/placeholder dashboards still need backend wiring and further acceptance-criteria QA. Flutter directory is still only a placeholder. Nothing in this package should be described as production-ready fintech functionality.

## Demo safeguards

All sample money figures, order states, price forecasts and security statuses must be regarded as illustrative. Do not use for production financial transactions, identity verification, government decision support or real logistics dispatch. Backend JWT/RBAC and service-level checks must be enforced independently of the six-role demo switcher.
