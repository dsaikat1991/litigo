# Litigo — Next Session Handoff

Last updated: 2026-07-27. Read this before touching code — it's the up-to-date resumption doc.
The previous handoff (edit/delete, forgot-password, profile page) is now fully done; this
replaces it wholesale rather than patching it, because almost everything in it shipped.

## What Litigo is

A legal memory platform for litigating advocates — Litigo preserves case knowledge, arguments,
research, and quick-capture notes ("Memories"), and makes it findable again years later. Brand
thesis: "Memory," not documents/AI/research, is the product. Founder is a practicing Kolkata
real-estate advocate building this for their own peer group — India-first by deliberate choice.

**It's live in production**, not just localhost: **https://mylitigo.com**, deployed on Vercel,
connected to a hosted Supabase project, with Google Analytics 4 confirmed actually receiving
real events. This is the single biggest status change since the last handoff.

## Current state — what actually works today

Verified live in-browser this session, not just compiled:

- **Auth**: signup → 3-step onboarding → dashboard; login; sign-out; **Google OAuth sign-in**
  (new-user first sign-in routes to onboarding, returning users to dashboard, via
  `src/app/auth/callback/route.ts` checking `user.created_at` recency); a real **forgot-password
  flow** (`/forgot-password` → email → `/auth/callback` → `/reset-password`), confirmed working
  end-to-end including on the real domain. Email confirmation is still **disabled** for dev
  convenience — re-enable before real users sign up with real emails they can't fake-confirm.
- **Dashboard** (`/dashboard`): sidebar nav (Home/Cases/Memories/Profile/Settings, icons, active
  highlighting — `src/components/dashboard/sidebar.tsx`), a **⌘K command palette**
  (`command-palette.tsx` — jump to a case, New case, Add memory, View profile, or fall back to
  search; must be wrapped in cmdk's `<Command>`, not just `<CommandDialog>`, or `CommandInput`
  crashes), an honest stats line ("N cases · N arguments..." — real counts, only shown when not
  filtering), status filter chips (Ongoing/Disposed/Archived, shared `case-status-filter.tsx`),
  and considered empty states for a brand-new account (`empty-state-panel.tsx`).
- **Search**: the `SearchBar` component (`search-bar.tsx`) now takes `basePath`/`scope`/
  `showCommandPaletteHint` props — `/dashboard` searches everything, `/dashboard/cases` searches
  only cases, `/dashboard/memories` searches only memories. While typing, it shows up to 5 live
  matches (`src/lib/actions/search.ts`) with the matched text **highlighted**, and — important —
  when a match comes from a non-title field (a tag, court, case number), it shows *which* field
  matched (`Tag: ipc 176`) instead of a highlight-less, seemingly-random result. Still plain
  `ILIKE` under the hood, not fuzzy — see "still open" below.
- **Cases**: create/edit/delete (with AlertDialog confirm), detail page with Arguments/Research/
  Memory tabs, each note type also has edit/delete. Dedicated list pages at `/dashboard/cases` and
  `/dashboard/memories` (single column, matching the dashboard's own layout).
- **Memories**: create/edit/delete, standalone or case-linked, click a row for full content in a
  dialog with edit-in-place.
- **Case-closing reflection prompt** (new, this session): editing a case's status *into* Disposed
  triggers an optional "what worked / what would you do differently / the one thing worth
  remembering" follow-up dialog. Anything filled in becomes one Memory, auto-tagged `lesson`,
  linked to the case; blank sections are omitted, not saved empty. Only fires on the transition
  into Disposed, not on every save of an already-closed case. See
  `case-closing-reflection-dialog.tsx` + the trigger logic in `edit-case-dialog.tsx`.
- **Profile page** (`/dashboard/profile`): full read/edit for everything onboarding collects —
  full_name, display_name, professional_title, bio, avatar_url (plain URL field, not real
  upload), country, locale, timezone, primary jurisdiction/licence details, and practice areas
  (`PracticeAreaPicker` now supports an `initialSelected` prop for editing, not just onboarding).
  **`organisation_name` was deliberately removed entirely** — not even as free text — per an
  explicit product decision that organisations/teams stay fully deferred. If you see any lingering
  reference to it, that's a regression, not intentional.
- **Marketing site**: real, non-placeholder copy on `/about` and `/how-it-works`; `/terms`,
  `/privacy`, `/contact` are still honest "coming soon" placeholders (`PlaceholderPage`
  component) — **this matters more than it looks like**, see "Before real documents" below.
  Footer nav (About/How It Works left, Terms/Privacy/Contact right) uses a `1fr auto 1fr` grid so
  the belief-statement text stays exactly centered regardless of unequal link-group widths.
- **SEO**: `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`, unique per-page `<title>`/
  description on every marketing page. All verified live on mylitigo.com.
- **Analytics**: GA4 (`G-NP928H4653`) via `@next/third-parties/google` in the root layout, gated
  to `NODE_ENV === "production"` so local/dev traffic never pollutes it. Confirmed live: real
  `dataLayer` events firing on mylitigo.com, correct measurement ID.
- **Design system**: IBM Plex Mono (headings) + Inter (body), a real logo/favicon (with explicit
  `width`/`height` now, to stop a Lighthouse layout-shift warning), a single `verified` green
  accent used *only* for confirmed/anchored states — don't spread it into general decoration.

## Two footguns this session hit twice — read before adding any new top-level route or env flag

1. **Any new top-level static/crawler-facing file (robots.txt, sitemap.xml, llms.txt, and
   whatever comes next) must be excluded in `src/proxy.ts`'s middleware matcher.** Otherwise an
   unauthenticated crawler request gets silently redirected to `/login` instead of getting the
   actual file — this exact bug shipped twice (once for robots.txt/sitemap.xml, caught before
   telling the user it was fixed; once for llms.txt, caught proactively the second time). The
   matcher currently excludes `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`,
   `sitemap.xml`, `llms.txt`, and image extensions — extend this list, don't just add a new public
   route and assume it works.
2. **`NEXT_PUBLIC_*` env flags meant to only be "real production" must be scoped to Vercel's
   Production environment only, never Preview.** `NODE_ENV === "production"` is true for *both*
   Vercel Production and Preview builds (both run `next build`), so the code-level check the GA
   integration uses can't tell them apart — the Vercel env-var scoping is the only actual
   enforcement. Getting this wrong means every PR/branch preview starts sending real events into
   the analytics account.

## What's deliberately not built yet

- **Real document storage** (pleadings, written statements, evidence, orders) — extensively
  planned this session (see "AI & documents strategy" below) but zero code exists yet. This is
  the founder's own explicit "Phase 1," not started.
- **AI-powered recall/precedent-discovery/drafting** — explicitly "Phase 2," deliberately deferred
  until there's a real corpus of captured cases to be useful over. Don't build this before Phase 1.
- **True fuzzy/typo-tolerant search** — `pg_trgm` is enabled but unused for this; still `ILIKE`.
  Flagged as open for three sessions running now — needs a scoping conversation, not a guess.
- **Structured opposing-party field.** `cases.parties` is still free text. This was named
  explicitly, more than once, as the single highest-leverage schema change still outstanding — it
  blocks both search precision ("argued limitation against SBI") and the "Opponent & Judge
  Intelligence" feature idea (see below). Small migration, worth doing before either.
- **Mobile-considered capture flow** — nothing in the dashboard has been checked or designed for a
  phone yet, despite "capture speed on mobile" being named as a real gap earlier in the project.
- **Real email delivery for password reset** — the mechanism (request → callback → reset) is
  verified correct end-to-end, but actual arrival in a real inbox has never been tested.
- Notification bell and "Advanced search" — still visibly present, still honestly inert.

## AI & documents strategy — agreed this session, nothing built yet

This is pure planning context that only exists in this conversation — worth preserving carefully,
because none of it is in the code yet.

**Positioning, locked in:** Litigo's AI answers *"what have I done before?"*, never *"what does
the law say?"* — deliberately not competing with ChatGPT/Claude/Harvey/CoCounsel, who own general
legal knowledge. Litigo owns institutional memory. Every AI answer must be grounded in and
clickable back to the user's own data — no hallucinated or unsupported answers, ever, given how
liability-sensitive legal work is.

**Core AI principles agreed** (none implemented yet):
1. Always grounded in the user's own data, always cited/traceable.
2. Combine structured filtering (matter type, court, stage, tags, parties, outcomes, dates) with
   semantic retrieval — not embeddings alone.
3. Proactive over time, not just a chat box — surface similar matters while creating a case,
   reusable arguments while drafting, relevant memories before a hearing.
4. Every interaction should strengthen the knowledge base (structured metadata + embeddings
   extracted from every note/document as it's captured).

**Build sequencing, explicitly agreed:**
- **Phase 1** (not started): secure document upload (Supabase Storage), OCR for scanned PDFs,
  metadata extraction, semantic indexing/embeddings, fast document search, linking documents to
  Cases/Memories/Arguments/Research. Explicitly **not** a full DMS — no version control, no
  check-in/check-out, no approval workflows, no folder hierarchies. Positioning stays "documents
  support memories, they are not the product."
- **Phase 2** (later, once there's a real corpus): AI-powered recall, precedent discovery,
  timeline generation, drafting assistance. The first AI experience should feel useful *because*
  the system already understands the user's history — not before that's true.

**Real risks flagged, not yet resolved — worth surfacing again before Phase 1 starts:**
- OCR on real scanned Indian court filings (stamps, seals, handwriting, mixed-language) is a
  genuinely hard problem, not an API checkbox — needs a real provider (Google Document AI, AWS
  Textract, Azure Document Intelligence), not bare Tesseract.
- The cost model changes fundamentally once storage + OCR + LLM extraction + embeddings are all
  metered per document — currently Litigo's marginal cost per user is ~zero (just Postgres rows).
- Confidentiality stakes rise sharply once real client documents are stored — this makes the
  still-placeholder Terms/Privacy pages a real blocker, not a nice-to-have, once Phase 1 starts.
  **Fix those pages before or alongside Phase 1, not after.**
- Automated metadata extraction will sometimes be wrong; needs a review/correct UI, not blind
  trust — a silently-wrong extracted opposing party or date poisons search results unnoticed.

**Three future-feature ideas discussed, ranked by how hard they'd be for a generic AI tool to
replicate** (only #3 is built):
1. **Opponent & Judge Intelligence** — auto-aggregated profiles built from cross-referencing the
   same opposing counsel/party/judge across the advocate's *own* case history ("you've faced
   Advocate X in 4 matters, here's what worked"). The single clearest "only Litigo could build
   this" idea — needs the structured opposing-party field above. Not built.
2. **Argument Genealogy** — let one argument note "refine/supersede" an earlier one, so an
   argument's evolution across a career is visible, not just a flat list. Small schema addition
   (self-referential link on `argument_notes`). Not built.
3. **Case-Closing Ritual** — **built this session**, see above.

## Working conventions established (keep following these)

- **Verify live in the browser after every change**, not just lint/build — this session alone
  caught: a command-palette crash from a missing `<Command>` wrapper, duplicate-`id` bugs across
  dialogs that can render multiple simultaneous instances on one page (fixed with `useId()` in
  `NewCaseDialog`, `AddMemoryForm`, the edit-note dialogs), and the robots.txt/llms.txt middleware
  redirect bug, twice.
- **When a dialog/form could ever render more than one instance on the same page at once**
  (reachable via a header button *and* an empty-state CTA *and* the command palette, for example),
  its field `id`s must be built from `useId()`, not hardcoded strings.
- **A browser-test script that checks `className.includes("foo")` can false-positive** if `foo` is
  a substring of another real class (e.g. `bg-muted` inside `hover:bg-muted/60`). Use exact
  token matching (`className.split(" ").includes("foo")`). This caused a real false-alarm
  debugging detour this session before the test script itself was found to be the bug, not the app.
- **Ship inert UI honestly, never fake a feature** — the Settings page, notification bell,
  "Advanced search," and Terms/Privacy/Contact are all visibly present but honestly inert/minimal.
- **Migrations are additive, one file per logical change**, run manually by the founder — always
  give the exact file path and wait for confirmation before assuming it's live. (No new migrations
  landed this session — the only schema change was *removing* the never-applied
  `organisation_name` migration file, since that feature was explicitly cancelled before it ever
  ran.)
- **No test suite exists in this project** — all verification is `tsc --noEmit` + `eslint` +
  `next build` + actual browser interaction. Don't claim something works without the last one.
- **Commit and push only when explicitly asked**, as its own distinct instruction — never bundled
  silently into a feature request, every single time this session.

## Where to start next session

No single next task was locked in — this session ended mid strategic-planning, not mid-build.
Live open threads, roughly in order of leverage:
1. **Structured opposing-party field on cases** — small, unblocks both search precision and the
   Opponent Intelligence idea. Good first task if picking up cold.
2. **Real content for `/terms` and `/privacy`** — cheap, and becomes urgent the moment Phase 1
   (real document upload) starts, not after.
3. Decide on an OCR provider and confirm the Phase 1 build strategy is still what's wanted before
   writing any of it — it's a meaningfully sized, cost-bearing commitment.
4. "Make search extremely smart" — still open after three sessions of being deferred; needs a
   real scoping conversation, not another guess.
5. A mobile-considered pass on the dashboard/capture flow — never addressed at all yet.
