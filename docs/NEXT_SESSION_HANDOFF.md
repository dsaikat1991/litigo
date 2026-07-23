# Litigo — Next Session Handoff

Last updated: 2026-07-27. Read this before touching code — it's the up-to-date resumption doc.

## What Litigo is

A legal memory platform for litigating advocates — Litigo preserves case knowledge, arguments,
research, and quick-capture notes ("Memories"), and makes it findable again years later. Brand
thesis: "Memory," not documents/AI/research, is the product. Founder is a practicing Kolkata
real-estate advocate building this for their own peer group — India-first by deliberate choice,
not by accident (see "Market strategy" below).

## Current state — what actually works today

Verified live in-browser this session, not just compiled:

- **Auth**: signup → 3-step onboarding → dashboard; login; sign-out (via avatar dropdown).
  Email confirmation is currently **disabled** for dev convenience — re-enable before real users
  sign up with real emails they can't fake-confirm.
- **Onboarding** (`/onboarding/personalize` → `/onboarding/details`): country/professional
  title/primary jurisdiction/timezone (required step), then organisation/practice
  areas/licensing details (skippable step). Practice areas use a real find-or-create picker
  (normalized `practice_areas` table, not free text).
- **Dashboard**: greeting (time-of-day, computed client-side to avoid a server/client mismatch),
  hero search bar with a custom recent-searches dropdown (localStorage, last 5) + example-query
  fallback, two-column Cases/Memories layout, per-case argument/research/memory counts.
- **Cases**: create, view detail (Arguments/Research/Memory tabs), tag-based search.
- **Memories**: standalone quick-capture (no case required) from the dashboard, or pre-linked
  from inside a case's Memory tab. Click any memory row to see full content in a dialog. No edit,
  no delete, no "link an existing memory to a case after the fact" yet.
- **Search**: spans cases + argument notes + research notes + memories in one query. Plain
  `ILIKE`, not fuzzy — see "make search extremely smart" below.
- **Design system**: IBM Plex Mono (headings) + Inter (body), a real logo/favicon (not
  placeholders), a single `verified` green accent used *only* for confirmed/anchored states
  (case-link badges, "Worked" outcomes, the avatar) — don't spread it into general decoration.

## What's next — confirmed priority order for this session

The founder named these three explicitly, in this order:

### 1. Basic edit/delete for cases, arguments, research, memories

Right now every one of these is create-only. No UI or server action exists to edit or delete a
case, an argument note, a research note, or a memory. This is the most-requested gap — a typo in
a case title currently can't be fixed at all.

Things to get right:
- RLS already scopes every table to `owner_id = auth.uid()` (`for all using (...) with check
  (...)`), so delete/update policies already exist at the database layer — this is server-action
  and UI work, not a migration.
- Memories have no title (by design, see README) — an edit form is just the content
  textarea + tags, pre-filled.
- Deleting a case should very likely cascade-delete its argument/research notes (check current FK
  `on delete` behavior before assuming) but should probably **not** delete memories that happen to
  be linked to it — memories are meant to outlive the case they were linked to (this is already
  how `memories.case_id` is set up: `on delete set null`, not cascade). Confirm this is still the
  desired behavior for a *manual* case deletion, not just a schema-level default.
- Consider whether "delete" needs a confirmation step (it's the first genuinely destructive
  action in this app) — a plain `confirm()` is probably too crude; a shadcn `AlertDialog` isn't
  installed yet (only `Dialog` is) — may need `npx shadcn@latest add alert-dialog`, or reuse
  `Dialog` with a clear "Delete" affirmative button.

### 2. Real "forgot password" flow

Doesn't exist. Supabase Auth supports this natively
(`supabase.auth.resetPasswordForEmail()` → emailed link → a page that calls
`supabase.auth.updateUser({ password })`). Needs:
- A "Forgot password?" link on `/login`.
- A request-reset page/form.
- A reset-password page that handles the Supabase recovery redirect and lets the user set a new
  password.
- This interacts with the "email confirmation is disabled" dev setting above — actually sending a
  reset email requires Supabase's email sending to be configured for real (check whether the
  hosted Supabase project has this working, or if it's still using Supabase's rate-limited
  default sender).

### 3. Complete profile page

There's currently no page in the app where a user can *see or edit* their own profile after
onboarding — onboarding writes the data, but nothing reads it back into an editable UI. Needs:
- A `/dashboard/profile` (or similar) route, gated the same way `/dashboard` is.
- Read + edit for everything onboarding collects: full_name, display_name, professional_title,
  bio, avatar_url, country_code, organisation_name, locale, timezone.
- Should probably also surface (read/edit) `professional_licences` (their primary jurisdiction +
  registration details) and `user_practice_areas` (reuse the `PracticeAreaPicker` component —
  it already exists at `src/components/onboarding/practice-area-picker.tsx` and takes
  `practiceAreas: PracticeArea[]` as a prop, but currently only *adds* new selections via hidden
  inputs for a create form — it has no "pre-populate with existing selections" mode yet, so it'll
  need a small extension to support editing, not just onboarding-time selection).
- `avatar_url` has a column but no upload flow anywhere yet — decide whether "complete profile
  page" includes building real avatar upload (Supabase Storage) or just a URL field for now.

## Also flagged as valuable, not yet chosen for this session

- **Deploy to production** (Vercel + confirm the Supabase project is real-traffic-ready). This
  was the founder's own top recommendation last session, ranked above all three items above — it
  may be worth asking whether it should happen before or alongside this list, since none of this
  matters yet if the app only runs on localhost.
- **"Make search extremely smart"** — still open, still unscoped. Real candidates: fuzzy/typo
  tolerance via the already-enabled `pg_trgm` (`similarity()`/`%` operator instead of plain
  `ILIKE`), live as-you-type result suggestions, or relevance ranking + highlighting. Don't guess
  which one without asking — this was explicitly deferred pending a scoping conversation twice
  already.
- Re-enabling email confirmation before real signups (ties into the forgot-password work above,
  since both depend on Supabase's email sending actually working).

## Working conventions established this session (keep following these)

- **Verify live in the browser after every change**, not just lint/build — several real bugs this
  session were only caught this way (the profile-locale server/client mismatch, the native
  browser search-clear button, the dropdown-reopen-after-click bug).
- **Ship inert UI honestly, never fake a feature.** Where something's designed but not backed by
  real functionality (the notification bell, "Advanced search"), it's a visibly disabled control
  with an honest `aria-label`, never a fake interaction or a silently-dropped design.
- **Migrations are additive, one file per logical change**, run manually by the founder via the
  Supabase SQL Editor (no CLI link set up) — always give the exact file path and wait for
  confirmation before assuming it's live.
- **A known tool quirk, not an app bug**: this session's browser-automation tool sometimes fails
  to open Radix-based popovers/dropdowns/tabs via synthetic clicks (coordinate-scaling and
  synthetic-event-trust issues), while a genuine `computer` tool click or a direct DOM `.click()`
  via `javascript_tool` reliably works. Don't mistake this for a real bug without cross-checking.
- **Commit messages should actually describe the commit** — one was auto-generated with a stale
  message ("Add new case creation modal") for a commit that was actually the whole Memory
  feature + dashboard redesign; it was amended (`git commit --amend`) and force-pushed once,
  which is fine for a solo repo but confirm before repeating that on a shared one.
