# Litigo — Next Session Handoff

Last updated: 2026-07-29. Read this before touching code — it's the up-to-date resumption doc.
The previous handoff (2026-07-27) is now stale on several fronts — dashboard, Court Diary,
observability, and typography all shipped or changed since then — this replaces it wholesale.

## What Litigo is

A legal memory platform for litigating advocates — Litigo preserves case knowledge, arguments,
research, and quick-capture notes ("Memories"), and makes it findable again years later. Brand
thesis: "Memory," not documents/AI/research, is the product. Founder is a practicing Kolkata
real-estate advocate building this for their own peer group — India-first by deliberate choice.

**It's live in production**, not just localhost: **https://mylitigo.com**, deployed on Vercel,
connected to a hosted Supabase project, with Google Analytics 4 and Sentry both confirmed
receiving real signal.

## Current state — what actually works today

Verified live in-browser this session (2026-07-29), not just compiled — including creating a
real test case, recording a hearing, disposing the case, and deleting everything again to leave
the account clean:

- **Auth**: signup → 3-step onboarding → dashboard; login; Google OAuth; forgot-password flow.
  **Sign-out bug fixed**: it used to sometimes strand the page on `/dashboard` until a manual
  refresh (`signOut()` called bare, un-awaited, from a non-form `DropdownMenuItem` — the internal
  `redirect("/login")` didn't reliably reach the client through that call path). Fixed by having
  `signOut()` not redirect internally; `HeaderProfileMenu` now awaits it inside a transition and
  pushes to `/login` only once it resolves. Verified live: sign-out lands cleanly on `/login`
  every time now.
- **Dashboard** (`/dashboard`) — rebuilt as a curated home view, not a flat list:
  - **Continue working**: a grid of in-progress case cards (stage, next hearing, note counts).
  - **Needs your attention**: real computed alerts — missing reflections, unlinked arguments,
    unlinked memories, hearings coming up within 7 days. Verified live: creating an unlinked
    memory and an argument-less case both surfaced here immediately, correctly worded.
  - **Preserve what this case taught you**: a banner reusing the case-closing reflection dialog.
  - **Recent memory**: a merged feed of arguments/research/memories, newest first.
  - **Practice insights**: 4 tiles — most-used tag and "arguments marked Worked" are real and
    live; "most frequent opponent" / "most appearances before" are honestly stubbed
    ("Coming soon — needs structured party data") since `cases.parties` is still free text.
  - **Content-type tabs** (All/Cases/Memories/Arguments/Research/Documents/People): Cases and
    Memories link to their real pages; Arguments/Research/Documents/People render disabled, not
    faked.
  - Header now also has a disabled "Upload document" button (`aria-label="Upload document
    (coming soon)"`) — confirmed inert, not a regression.
- **Case lifecycle**: cases now carry **Stage** and **Next hearing** (always editable), plus a
  **Decision section** (Judgement/Order date, Nature of decision — a select with an "Other" that
  reveals free text, Outcome) that only appears once status is Disposed or Archived, and is
  preserved via hidden fields if reverted to Ongoing (nothing silently wiped — confirmed by
  reading `edit-case-dialog.tsx`). Status badges are color-coded (Ongoing=green, Disposed=light
  grey, Archived=solid). Verified live end-to-end: created a case, edited it to Disposed, the
  Decision fields appeared, and the case-closing reflection dialog fired correctly on top of the
  rebuilt dashboard.
- **Case Timeline & Court Diary** (new since last handoff): a hearing outcome (stage, purpose,
  arguments made, court direction, tasks, next date) is now logged as a permanent, searchable
  timeline event on the case (`case-timeline.tsx`, `record-hearing-dialog.tsx`) instead of
  overwriting the case record. Recording a hearing correctly bumps the case's own "Next hearing"
  field — verified live. Each hearing auto-schedules 7/3/1-day and same-day reminders, both
  in-app (notification bell, `notification-bell.tsx`) and email via Resend
  (`RESEND_API_KEY` in `.env.local`, optional — logs instead of sending if unset). A daily Vercel
  Cron (`vercel.json`: `/api/cron/notifications` at 3:30am, secured by `CRON_SECRET`) generates
  due reminders. New **Court Diary** page (`/dashboard/diary`) with Today/Next 7 Days/This
  Month/Past Hearings tabs. Verified live: recorded a hearing with a next-hearing date, it
  appeared correctly under Court Diary's "Next 7 Days" tab, and the notification bell showed a
  real "Begin preparation" reminder for it.
- **Memory-case linking, everywhere**: any memory can be linked to a case at creation or after
  the fact via a shared case picker (`memory-case-select.tsx`) — previously only memories
  created from within a case got linked. A real bug was fixed along the way: `updateMemory` was
  silently dropping `case_id` changes. Verified live: linked a memory to a case via the picker,
  confirmed it appeared under that case's Memory tab; deleting the case correctly unlinked
  (not deleted) the memory, confirmed by the "Not linked to a case" label after.
- **Search**: unchanged in behavior from last handoff — `SearchBar` with `basePath`/`scope`/
  `showCommandPaletteHint`, live matches with highlighting and matched-field labels. Still plain
  `ILIKE`, not fuzzy.
- **Cases / Memories CRUD**: unchanged — create/edit/delete with AlertDialog confirms, detail
  page now has a **Timeline** tab alongside Arguments/Research/Memory.
- **Profile page** (`/dashboard/profile`): unchanged from last handoff — full read/edit,
  `organisation_name` still deliberately absent.
- **Marketing site — redesigned twice this session**:
  - First pass: hero rebuilt with a year-grouped chronological search-preview mockup and a
    typewriter headline (findable/reusable/compounding).
  - Second, superseding pass (`e8013be`, latest): that two-column hero was replaced again with a
    **static stacked, Linear-inspired layout** — left-aligned headline + copy, and a large
    dashboard screenshot mockup (`dashboard-preview.tsx`: sidebar, header, case cards, attention
    panel) that breaks out wider than the page content. The typewriter component
    (`animated-headline-word.tsx`) was deleted in this pass — if you see it referenced anywhere,
    that's stale, not a bug to fix.
  - Sub-heading copy now leads with "Litigo remembers…" instead of a feature list, and no longer
    mentions "draft" since drafting isn't an actual feature yet. Verified live.
- **Typography system overhaul, codebase-wide**: IBM Plex Mono removed as the primary UI font
  everywhere (~30 files) — **Inter is now the primary font app-wide**, cascading from 3 shared
  primitives (`card.tsx`, `dialog.tsx`, `alert-dialog.tsx`). **Manrope** introduced as the
  secondary font for genuine reading/explanatory text (descriptions, empty-state copy, marketing
  prose) — deliberately excluded from labels/badges/compact chrome, which stay on Inter. Plex
  Mono survives only for the "01/02/03" step numbers on `/how-it-works`, now via Tailwind's
  standard `font-mono` rather than the removed `font-heading` alias. Verified live via computed
  styles: h1 → Inter, sub-heading paragraph → Manrope.
- **Observability stack, added this session, all verified configured correctly**:
  - **Sentry** (`@sentry/nextjs`) for client/server/edge, behind a shared scrub function
    (`src/lib/sentry-scrub.ts`) — no session replay, no default PII, cookies/headers/body
    stripped, URLs truncated at `?` so search terms and case names never leave the app. DSN/token
    are `.env.local`-only, documented in `.env.example`.
  - **Root error boundary** (`src/app/error.tsx`): matches the auth-page visual style; retrying
    refreshes the Supabase session first (not just the render), since a session-shaped failure
    would otherwise just reproduce itself. It also **independently checks session validity on
    mount** and shows a distinct "sign in again" message with a direct `/login` link when the
    real cause is a dead session (production strips real error messages, so this is the only way
    to tell a stale-JWT crash apart from an unrelated bug).
  - **Vercel Speed Insights** — self-detecting, no-op locally.
  - **Perf/funnel scoping** (`7364176`): GA4 only loads on public marketing/signup routes (never
    `/dashboard`), via `next/script`'s `lazyOnload`. Sentry's `BrowserTracing` is filtered out of
    default integrations everywhere except `/dashboard`
    (`dashboard-performance-monitoring.tsx`), because adding Sentry + Speed Insights dropped
    PageSpeed from 100 → 68 on marketing pages before this fix. `sonner.tsx` and its now-orphaned
    deps (`next-themes`, `sonner`, `@next/third-parties`) were removed as dead weight.
  - `shadcn` moved to devDependencies (CLI-only, zero runtime imports — dependency-tree
    correctness, no bundle impact).
- **Dashboard perf pass** (P0/P1 from an FCP/LCP investigation this session):
  - `NewCaseDialog`/`AddMemoryDialog` were each mounting **twice** per page (once in the header,
    once again nested inside `CommandPalette`) — deduped into a Root (context + single
    `next/dynamic`, `ssr:false`, lazy-mounted instance) + Content + lightweight trigger buttons,
    so every entry point opens the same instance and its JS isn't fetched until first opened.
    Same fix applied to `/dashboard/cases` and `/dashboard/memories`.
  - `RecentActivityPanel`'s edit/delete dialog was unconditionally mounted for every load; split
    into an eager list + a lazy `recent-activity-detail-dialog.tsx`.
  - Below-the-fold widgets (Needs Attention, Recent Memory, Practice Insights) now stream in
    independently via their own `<Suspense>` boundaries and async Server Components, instead of
    one blocking `Promise.all` for the whole page. `getAttentionAlerts()` is wrapped in React's
    `cache()` since two of the async widgets both read it.
  - Attention Panel + Recent Activity Panel were then **merged back into one** Suspense boundary
    (`dashboard-side-panel-async.tsx`) — they're stacked in the same column, and two independent
    boundaries resolving at slightly different moments was visibly "shaking" the page on every
    fresh `/dashboard` navigation.
- **Header dropdown page-shift bug, fixed**: Radix's default modal `DropdownMenu` injects a
  `body[data-scroll-locked] { margin-right: 15px !important }` rule that fights with the page's
  own `scrollbar-gutter: stable`, visibly shifting the page on every open/close of the
  notification bell or profile menu. Fixed via `modal={false}` on both. Verified live: computed
  `margin-right` stayed `0px` and `data-scroll-locked` stayed absent with the notification
  popover open.
- **SEO / Analytics**: unchanged from last handoff, still verified live on mylitigo.com.

## Two footguns from last session — still true, still worth re-reading

1. **Any new top-level static/crawler-facing file must be excluded in `src/proxy.ts`'s
   middleware matcher**, or an unauthenticated crawler request gets silently redirected to
   `/login`. This bit twice before (robots.txt/sitemap.xml, then llms.txt).
2. **`NEXT_PUBLIC_*` env flags meant for "real production only" must be scoped to Vercel's
   Production environment**, never Preview — `NODE_ENV === "production"` can't tell the two
   apart on its own.

## What's deliberately not built yet

- **Real document storage** — still zero code, still the founder's explicit "Phase 1." The
  header's disabled "Upload document" button is the only surface acknowledging it exists as a
  planned feature.
- **AI-powered recall/precedent-discovery/drafting** — still explicitly "Phase 2," deferred until
  there's a real corpus.
- **True fuzzy/typo-tolerant search** — `pg_trgm` enabled but unused; still `ILIKE`. Flagged as
  open for four sessions running now.
- **Structured opposing-party field** — `cases.parties` still free text. Still the single
  highest-leverage schema change outstanding; now also the explicit reason two Practice Insights
  tiles ("most frequent opponent," "most appearances before") are stubbed rather than real.
- **Mobile-considered capture flow** — still never addressed.
- **Real email delivery verification** — Resend is wired for both password-reset and the new
  hearing-reminder emails, but actual arrival in a real inbox is still untested for either.
- **Real document arrival testing for reminders** — the notification bell and Court Diary are
  verified correct in-app; the Resend email side of the same reminder pipeline has not been
  confirmed to actually land in an inbox yet.
- Notification bell is now real (not inert) for hearing reminders specifically — but "Advanced
  search" is still visibly present and honestly inert.

## AI & documents strategy — still just planning, nothing built

Unchanged since last handoff — see the prior version of this doc (in git history) for the full
writeup if needed. Short version: Litigo's AI would answer *"what have I done before?"*, never
*"what does the law say?"*, always grounded in and clickable back to the user's own data. Phase 1
(document upload/OCR/embeddings/search) is not started; Phase 2 (AI recall/drafting) comes after.
The three future-feature ideas (Opponent & Judge Intelligence, Argument Genealogy, Case-Closing
Ritual) are unchanged — Case-Closing Ritual remains the only one built.

## Working conventions established (keep following these)

- **Verify live in the browser after every change**, not just lint/build. This session's own
  catches: the sign-out stranding bug, the dropdown page-shift, and the two-independent-Suspense
  "shaking" regression were all found this way, not by reading code.
- **When a dialog/form could ever render more than one instance on the same page at once**, its
  field `id`s must be built from `useId()`, not hardcoded strings (established last session,
  still holds — the new Root/Content/Trigger dialog split doesn't change this).
- **Ship inert UI honestly, never fake a feature** — now also applies to "Upload document" in the
  dashboard header, in addition to the existing Settings/notification-bell-for-non-hearing-
  things/Advanced search/Terms/Privacy/Contact placeholders.
- **Migrations are additive, one file per logical change**, run manually by the founder. Three
  landed this session: `20260727010000_add_case_stage_and_dates.sql`,
  `20260728000000_add_case_decision_fields.sql`,
  `20260729000000_add_case_timeline_and_court_diary.sql`.
- **No test suite exists** — verification is `tsc --noEmit` + `eslint` + `next build` + actual
  browser interaction.
- **Commit and push only when explicitly asked** — still a distinct instruction every time.
- **New convention this session**: when investigating a perf regression, verify the actual
  mechanism directly (e.g. computed `margin-right`/`data-scroll-locked` state, or grepping a
  compiled chunk for a string unique to one component) rather than inferring from a code read
  alone — this caught real bugs that a plausible-looking fix would have missed.

## Where to start next session

1. **Structured opposing-party field on cases** — same leverage as before, now also unblocks two
   already-built-but-stubbed Practice Insights tiles, not just search and the Opponent
   Intelligence idea. Still the strongest first task if picking up cold.
2. **Confirm Resend emails actually arrive** — both password-reset and hearing-reminder emails
   are wired and logged, but neither has been confirmed to land in a real inbox.
3. **Real content for `/terms` and `/privacy`** — same urgency as before, more so now that real
   case timeline data (arguments, court directions, tasks) is being stored, not just case
   metadata.
4. Decide on an OCR provider and confirm the Phase 1 build strategy before writing any of it.
5. "Make search extremely smart" — still open after four sessions of being deferred.
6. A mobile-considered pass on the dashboard/capture flow — never addressed at all yet.
