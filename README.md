# Litigo

A legal memory platform for litigating advocates — preserve case knowledge, arguments, and
research, and find it again years later.

## Stack

- Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + Row Level Security)
- Postgres full-text/trigram search (`pg_trgm`) over free-form tags and notes

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
4. **Run the database migration**: open the Supabase dashboard's SQL Editor and run the contents
   of [`supabase/migrations/20260723000000_init_schema.sql`](supabase/migrations/20260723000000_init_schema.sql).
   (Or, if you install the [Supabase CLI](https://supabase.com/docs/guides/cli) and link this
   project to your hosted project with `supabase link`, you can run `supabase db push` instead.)
5. **Disable email confirmation for local testing** (optional): Authentication → Providers →
   Email → turn off "Confirm email", so sign-up logs you straight in without needing a real inbox.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up creates an isolated advocate
account — Row Level Security means every advocate only ever sees their own cases and notes.

## Data model

- **cases** — the matter itself: title, court, parties, status, free-form tags.
- **argument_notes** — points argued (or to argue), scoped to a case, with an outcome
  (worked/failed/untested) and free-form tags.
- **research_notes** — statutes, judgments, articles relied on, scoped to a case, with free-form
  tags.

All three tables are searched together via `search_text` (a generated column with a trigram
index), so the dashboard search box matches case titles, note content, and tags in one query —
case-insensitive and typo-tolerant.

## What's deliberately not built yet

The knowledge-graph/AI-assistant layer (auto-linking related past cases, natural-language "show
me every case like X") is intentionally deferred past this MVP. The current scope validates the
core pain point — a searchable personal case archive — before investing in that harder layer.
