# Deployment Checklist

Laurel's Organized Chaos is a full-stack TanStack Start application. It needs a host that can run a Node/Nitro server or another supported TanStack Start target. It is **not** a static GitHub Pages site.

## Before deploying

1. Create or choose the production hosting provider.
2. Add the required environment variables in that provider's secret/settings UI.
3. Point the deployment at this repository and the `main` branch.
4. Apply any new Supabase migrations that are not yet present in the target database.
5. Build with:
   ```sh
   bun install
   bun run build
   ```
6. Start a Node/Nitro deployment with:
   ```sh
   bun run start
   ```
7. Verify `/healthz` returns an `ok: true` JSON response.
8. Verify `/robots.txt` and `/sitemap.xml`.
9. Test owner sign-in, draft editing, image upload, publishing, and the contact form.
10. Only then connect the final custom domain.

## Required environment variables

Server-only:

```env
OWNER_EMAIL=
SUPABASE_PROJECT_ID=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=
```

Browser-safe Vite values:

```env
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `OWNER_EMAIL` with a `VITE_` prefix.

## Database migration note

The repository contains the migration that blocks direct anonymous inserts into `contact_messages`:

```
supabase/migrations/20260929110000_lock_down_contact_inserts.sql
```

The contact page expects that migration to be applied in production because public messages now travel through a validated server function.

## Current hosting status

No production host has been chosen or deployed from this GitHub-first version yet. The existing Lovable preview remains only a reference build.
