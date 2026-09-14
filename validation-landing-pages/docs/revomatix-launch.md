# Revomatix launch handoff

## Current verification boundary

Local preview: http://127.0.0.1:5173/moving?test=true

The existing Vercel project is `ai-app-studio` (`prj_hVRMASbJEEt33L4AGrJ1hZGzkBR1`). Saved Vercel authentication returned 403. No deployment or DNS changes were performed. The target Google Sheet/tab and operator/privacy contact have not been supplied. Live writes, actual Supabase RPC execution and production analytics are not verified.

## Configure existing services

1. Supply the target Google Sheet URL and exact tab name. Inspect its first row before changes. The endpoint reads headers and maps by name, case-insensitively; it will reject missing/duplicate required headers. It never overwrites headers or unrelated columns. Prefer a dedicated Revomatix tab. Add the required columns only after reviewing the target. Keep this intake tab append-only: do not sort/insert/delete rows while receiving leads; use filter views or another reporting tab.
2. Required headers (any order): `Submission ID`, `Timestamp`, `Name`, `Work email`, `Company`, `Volume`, `Current spend`, `Current use`, `Channel preference`, `Optional answer`, `Related issues`, `Anonymized examples`, `Niche`, `Submission path`, `Original landing path`, `UTM source`, `UTM medium`, `UTM campaign`, `UTM content`, `UTM term`, `Referrer`, `Test traffic`.
3. Share the sheet with the existing Google service account as Editor. Configure `REVOMATIX_SHEET_ID`, `REVOMATIX_SHEET_TAB`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` in Vercel Project Settings → Environment Variables. Never prefix server secrets with VITE_. A raw PEM, escaped-newline PEM or complete service-account JSON is supported for the private-key value. Do not paste secrets in chat or commit them.
4. Run `supabase/revomatix_lead_reservations.sql` in the existing Supabase project's SQL editor. Confirm use of that project first. It creates only an isolated idempotency ledger/RPC with service-role-only access, not a CRM. Configure server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. A durable reservation keeps retries on the same row even when Google's save response is lost. Contact data is not stored in this ledger.
5. Supply the actual operator name and privacy email; configure `VITE_REVOMATIX_OPERATOR` and `VITE_REVOMATIX_PRIVACY_EMAIL`. `/privacy` uses these details and describes Vercel, Google Sheets, the Supabase ledger and optional PostHog. Missing details are explicitly marked as a launch blocker rather than fabricated.
6. Optionally reuse `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` after confirming the account. Measurement is off until the visitor opts in. Only explicit page-view, CTA-click and confirmed-lead events are sent. No full URLs, form data or referrers are included. Test visits never send events. Metrics represent consenting visitors only. No autocapture, replay, tracking cookie or unrelated analytics SDK is initialized on voice/privacy routes.

Variable names only: `docs/revomatix.env.example`. Put local values in ignored `.env.local`; set production values securely in Vercel and rebuild for VITE_ changes.

## Deploy and verify

Restore Vercel access by signing into the correct team/project. Use the existing project deployment workflow; its SPA rewrite already preserves `/api/*` and supports direct nested routes. If using CLI from this directory: `vercel --prod` (review the target project before deploying). No paid service is required by this implementation. Do not deploy unrelated dirty files from the parent repository.

Before outreach, open the provider-generated deployment URL. Submit one clearly synthetic lead using `/moving?test=true&utm_source=qa&utm_medium=test&utm_campaign=launch-check`. Verify all 22 fields and the unchanged submission ID on retry in the real sheet. Confirm invalid input, a safely simulated failure and no test analytics conversion. The local test suite uses fake upstream services; it does not establish live integration.

Commands:

```sh
npm run build
node --test tests/revomatix.test.cjs
npm run dev -- --host 127.0.0.1
```

## Later domain task: details to obtain from your partner

- Exact purchased domain and preferred canonical host (www or apex).
- Registrar/DNS provider and access via account invitation, not a shared password.
- The hosting team/project that should own the domain and an account invitation if different.
- Current DNS export or read access, especially MX, SPF, DKIM and DMARC records.
- Desired root-page behavior (the current repository root still serves an older experiment; do not point the custom domain at it until this is agreed).

DNS records must come from the hosting provider when connection is performed. No records are guessed here.

## Outreach tags

Once the provider-generated URL is verified, replace HOST below with it:

- `https://HOST/moving?utm_source=linkedin&utm_medium=manual_outreach&utm_campaign=moving_validation`
- `https://HOST/moving?utm_source=manual_calls&utm_medium=phone&utm_campaign=moving_validation`
- `https://HOST/moving?utm_source=email&utm_medium=outreach&utm_campaign=moving_validation`

First-arrival attribution persists in sessionStorage for the browser-tab visit. Missing tags stay blank. Actual submission path is separate. `test=true` remains sticky for the visit. Storage-disabled browsers use a memory fallback, so full navigation cannot preserve attribution in that exceptional case.

## Scoped Git

```sh
git add package.json api/revomatix-submit.ts server/revomatix/ supabase/revomatix_lead_reservations.sql src/voice/leadClient.ts src/voice/Privacy.tsx src/voice/VoiceApp.tsx src/voice/voice.css src/main.tsx index.html vite.config.ts tsconfig.node.json tests/revomatix.test.cjs docs/revomatix-launch.md docs/revomatix.env.example
git diff --cached --stat
git diff --cached
git commit -m "Add Revomatix lead capture and attribution"
git push
```

No commit or push has been performed by this task.

## Confirmed business and sheet details

Operator: Revomatix. Privacy/contact: sales@revomatix.com. These are the defaults in src/voice/Privacy.tsx and can be overridden with the named VITE_ variables.

Target: https://docs.google.com/spreadsheets/d/1FwRtIuCp3OsTJtx3_TnfX0Zth1mrRpKXxa5cmHBse_g/edit . Requested tab: first. Sheet access and actual writes must be verified before outreach. A separate Vercel project is authorized if useful; it still needs account access.
