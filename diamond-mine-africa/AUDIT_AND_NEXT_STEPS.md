# Diamond Mine Africa — Audit and Next Steps

This file supersedes earlier audit notes. For the current status, see:

- `VERIFICATION_STATUS.md` — implemented changes and verification limits.
- `DEPLOY_STEPS_AMHARIC.md` — deployment checklist in Amharic.
- `supabase/migrations/202610130001_accept_platform_rules.sql` — run this one migration once against the existing Supabase project before testing the post-registration rules acknowledgement.

## Current release scope

Supabase phone authentication/profile lookup is implemented as an optional path. Core rewards, VIP purchases/claims, team rewards, recharge, withdrawal, and admin workflows remain demonstration/localStorage flows. Keep `VITE_DEMO_MODE=true`. Do not accept real funds or payouts from this build.
