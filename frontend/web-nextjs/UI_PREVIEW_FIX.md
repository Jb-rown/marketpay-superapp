# MarketPay — UI Preview Access Fix

## Why direct links redirected to login

The previous `middleware.ts` required an `access_token` cookie for every workspace route and checked an obsolete set of `/dashboard/...` paths. As a result, direct visits to `/consumer`, `/vendor`, and other implemented pages were sent back to `/login`.

## Fix

- When running **`npm run dev`**, all 53 UI routes are now accessible without an auth cookie (by default).
- `/mfa` and `/offline` are also recognized as public UI preview pages.
- Updated routing uses the actual workspace prefixes: consumer, vendor, wholesaler, rider, government, admin.
- A small banner identifies the development demonstration UI.
- In production (`npm run build && npm run start`), development preview **cannot** bypass the middleware.
- Set `MARKETPAY_UI_PREVIEW=false` and `NEXT_PUBLIC_MARKETPAY_UI_PREVIEW=false` to test login protection during development. Restart the dev server after changing env vars.

## Use

```bash
cd frontend/web-nextjs
npm install
npm run dev
```

Then visit `http://localhost:3000/consumer`, `/vendor`, `/wholesaler`, `/rider`, `/government`, or `/admin`, plus their subroutes.

## Security boundary

These screens use demonstration data and should not be mistaken for authenticated application behavior. The current production middleware uses an unverified JWT payload for UI role routing only; a real backend/API gateway must validate JWT signatures, account state, permissions, and every financial operation before production deployment. A UI preview must **never** be used to authorize real API requests.

## Files changed in this fix

- `frontend/web-nextjs/middleware.ts`
- `frontend/web-nextjs/components/layout/app-shell.tsx`
- `frontend/web-nextjs/.env.example`
- `frontend/web-nextjs/UI_PREVIEW_FIX.md`
