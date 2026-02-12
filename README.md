# Smart Bookmark App

A minimal bookmark manager built with **Next.js App Router**, **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**.  
Users sign in with Google, add/delete bookmarks, and see changes in real‑time across tabs.

## Live Demo

https://smart-bookmark-app-theta.vercel.app/

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Row Level Security, Realtime)
- **Auth**: Google OAuth via Supabase Auth
- **Deployment**: Vercel


## Problems I Ran Into And How I Solved Them


1. TypeScript extension imports (`.ts`/`.tsx`) in component imports caused compatibility issues.
   Fixed by converting imports to extensionless module paths.

2. Next.js 16 server cookie API requires `await cookies()`.
   Fixed by making server Supabase client async and awaiting it in server components/actions/routes.

3. Bookmark realtime subscription could mix events or duplicate inserts.
   Fixed by user-specific channel filters (`user_id=eq.<id>`), duplicate guards, and syncing state from refreshed server props.



