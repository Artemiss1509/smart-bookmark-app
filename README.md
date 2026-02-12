# Smart Bookmark App

Bookmark manager built with Next.js App Router, Supabase Auth/Database/Realtime, and Tailwind CSS.

## Live Demo

- Vercel URL: `ADD_YOUR_VERCEL_URL_HERE`
- GitHub URL: `ADD_YOUR_GITHUB_REPO_URL_HERE`

## Features Implemented

- Google Auth only (no email/password UI).
- Add bookmark (`title` + `url`) for logged-in user.
- Per-user private bookmarks.
- Real-time updates across tabs (insert/delete).
- Delete own bookmarks.

## Tech Stack

- Next.js (App Router)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS
- Vercel deployment target

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3. Run app:

```bash
npm run dev
```

4. Build check:

```bash
npm run build
```

## Supabase Setup

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.bookmarks enable row level security;

drop policy if exists "Users can view own bookmarks" on public.bookmarks;
create policy "Users can view own bookmarks"
on public.bookmarks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
create policy "Users can insert own bookmarks"
on public.bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own bookmarks" on public.bookmarks;
create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
to authenticated
using (auth.uid() = user_id);
```

Then enable Realtime for `public.bookmarks` in Supabase:

- Database -> Replication -> `bookmarks` -> Enable.

## Google Auth Setup

In Supabase:

1. Auth -> Providers -> Google -> Enable.
2. Add Google OAuth Client ID/Secret.
3. Set redirect URL:
   - Local: `http://localhost:3000/auth/callback`
   - Vercel: `https://YOUR_VERCEL_DOMAIN/auth/callback`

## Vercel Deployment

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Add deployed callback URL in Supabase and Google console.

## Problems I Ran Into And How I Solved Them

1. Auth callback route was misnamed (`router.ts` instead of `route.ts`), so OAuth callback would not execute.
   Fixed by renaming to `app/auth/callback/route.ts`.

2. TypeScript extension imports (`.ts`/`.tsx`) in component imports caused compatibility issues.
   Fixed by converting imports to extensionless module paths.

3. Next.js 16 server cookie API requires `await cookies()`.
   Fixed by making server Supabase client async and awaiting it in server components/actions/routes.

4. Bookmark realtime subscription could mix events or duplicate inserts.
   Fixed by user-specific channel filters (`user_id=eq.<id>`), duplicate guards, and syncing state from refreshed server props.

5. Build-time failures happened when local Supabase env values were placeholders.
   Fixed with safe fallback normalization for local build only; deployment still requires real env values.

6. Middleware deprecation warning in Next.js 16.
   Fixed by migrating `middleware.ts` to `proxy.ts`.

## Notes For Reviewer

- The app is private-by-design through both query filtering and RLS policies.
- Deletion is restricted to owner rows in both server action and RLS.
- Real-time behavior can be tested by opening two authenticated tabs and adding/deleting bookmarks.
