# Diamond Mine Africa — Verification Status

## Implemented in this bundle

- Optional Supabase phone + password signup/login path (SMS/OTP not used by the UI).
- Ethiopian mobile phone normalization and basic validation.
- Supabase profile lookup and persisted auth session handling.
- Database profile trigger in `supabase_schema.sql` and Platform Rules acknowledgement migration.
- Node runtime requirement declared in `package.json` (`>=20.19.0`).
- Explicit DEMO MODE notices retained. `VITE_DEMO_MODE=true` is required.
- Amharic deployment and environment-variable instructions included.

## Checks

- A prior syntax/transpile check reported 32 TypeScript/TSX files parsed with 0 syntax diagnostics.
- A prior demo-store test run reported 13 passed, 0 failed.
- User screenshot from Supabase SQL Editor displayed 16 public tables after initial schema setup.
- Current attempt to install dependencies (`npm install --no-audit --no-fund`) timed out; therefore a fresh full `npm run lint` and `npm run build` could not be run here. The final Vercel build must be checked after commit.
- No live end-to-end Supabase Auth test, browser/mobile test, or Vercel production deployment was performed in this environment.

## Boundaries

Supabase Auth and profile lookup are a development integration. VIP purchase/claims, demo balances, daily check-ins, tasks, referral/commission summaries, recharge/withdrawal requests and admin flows remain local demo state. They do not work as a shared multi-user financial ledger. Never accept real deposits or payouts with this code. Phone confirmation disabled means no phone ownership verification, which is not suitable for sensitive accounts.
