# Litigo

A legal memory platform for litigating advocates — preserve case knowledge, arguments, research,
and quick-capture notes, and find any of it again years later.

## Stack

- Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + Row Level Security)
- Postgres full-text/trigram search (`pg_trgm`) — currently powers case-insensitive `ILIKE`
  matching across cases, notes, and memories; not yet true typo-tolerant fuzzy matching (see
  "What's deliberately not built yet")
- Fonts: Inter (body/UI) + IBM Plex Mono (headings/brand — deliberately not Geist, the
  create-next-app default)

## First-time setup

This environment has no Docker, so Supabase's local dev stack can't run here — you'll need a
free hosted Supabase project instead.

1. **Create a Supabase project**: [supabase.com/dashboard](https://supabase.com/dashboard) →
   New Project (free tier is enough to start).
2. **Get your API keys**: Project Settings → API → copy the Project URL and the `anon` public key.
3. **Set environment variables**: copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Run every migration in `supabase/migrations/` in order**, oldest first, via the Supabase
   dashboard's SQL Editor (or `supabase db push` if you've linked the CLI):
   1. `20260723000000_init_schema.sql` — cases, argument_notes, research_notes, profiles
   2. `20260724000000_add_memories.sql` — standalone Memory quick-capture
   3. `20260725000000_add_profile_locale.sql` — per-user locale/timezone
   4. `20260726000000_global_profile_restructure.sql` — professional_licences, practice_areas,
      user_practice_areas; drops the unused `bar_registration_number` column
   5. `20260727000000_add_profile_organisation.sql` — `profiles.organisation_name`
5. **Disable email confirmation for local testing** (optional): Authentication → Providers →
   Email → turn off "Confirm email", so sign-up logs you straight in without needing a real inbox.
   **Re-enable this before any real user signs up with a real email** — see handoff doc.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up walks through a 3-step flow
(create account → personalise → optional professional details) before landing on the dashboard.
Row Level Security means every advocate only ever sees their own cases, notes, and memories.

## Data model

- **cases** — the matter itself: title, court, parties, status, free-form tags.
- **argument_notes** — points argued (or to argue), scoped to a case, with an outcome
  (worked/failed/untested) and free-form tags.
- **research_notes** — statutes, judgments, articles relied on, scoped to a case, with free-form
  tags.
- **memories** — standalone quick-capture notes (content + free-form tags), optionally linked to
  one case (`case_id` nullable, `on delete set null` — a memory outlives the case it was linked
  to). No title field by design; the UI derives a preview from the first line of content.
- **profiles** — full_name, display_name, professional_title, bio, avatar_url, date_of_birth,
  country_code, currency_code, preferred_language, organisation_name, **locale + timezone**
  (used by every date-formatting call in the app — see "Locale/timezone" below).
- **professional_licences** — multi-jurisdiction bar/licensing records per user (country_code,
  jurisdiction_name, licensing_authority, registration_number, admission_date, is_primary —
  enforced to at most one primary per user via a partial unique index).
- **practice_areas** / **user_practice_areas** — a *normalized*, shared reference list (not
  free-text) with case-insensitive-unique names, supporting a find-or-create UI flow. Seeded with
  15 common Indian practice areas.

Cases, argument/research notes, and memories are searched together via `search_text` (a
trigger-maintained column — **not** a Postgres `GENERATED` column, because `array_to_string()`
isn't `IMMUTABLE`, which generated columns require), so the dashboard search matches case titles,
note content, memory content, and tags in one query.

## Locale/timezone

Every date-displaying component takes `locale`/`timeZone` as explicit props sourced from
`getCurrentProfile()` — there is **no default parameter** on `formatDate`/`formatDateTime` in
`src/lib/utils.ts`, by design, so a call site can't silently fall back to an ambient/wrong value.
A bare `Intl.DateTimeFormat(undefined, ...)` was tried and reverted: it resolves differently in a
Server Component (the Node process's default) than in a Client Component (the browser's),
producing inconsistent formatting for the same viewer on the same page. Don't reintroduce that
pattern.

## What's deliberately not built yet

- **The knowledge-graph/AI-assistant layer** (auto-linking related past cases, natural-language
  "show me every case like X"). Intentionally deferred past this MVP.
- **True typo-tolerant fuzzy search.** `pg_trgm` is enabled and indexing `search_text`, but the
  actual queries use plain `ILIKE '%term%'`, which requires an exact substring — a typo like
  "conveyence" will not match "conveyance" today. Explicitly flagged as an open ask ("make search
  extremely smart") that still needs a scoping conversation before building.
- **Organisations/chambers as a real multi-tenant feature** (teams, roles, invites). Deliberately
  deferred twice now — it's orthogonal to "going global," which is about jurisdiction, not teams.
  `profiles.organisation_name` is just a free-text field for now, not a relational feature.
- **Linking an existing standalone memory to a case after the fact**, and **promoting a memory
  into a formal argument/research note** — both named on the user's own roadmap as future, not
  part of the current Memory feature.
- **Advanced search / filter icon and the notification bell** are visibly present in the UI but
  intentionally inert (no `onClick`, honest `aria-label`s like "coming soon") — shipped this way
  rather than faking a feature or silently omitting what was already designed/approved.
