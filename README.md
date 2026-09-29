# Laurel's Organized Chaos Blog

The new full-stack home for **Laurel's Organized Chaos**: a personal blog and digital scrapbook with a public witchy-gothic site and a private owner-only content editor.

This repository was copied from the working Lovable Version 1 snapshot on September 29, 2026 so development can continue directly in GitHub without spending Lovable credits.

## Current Version 1

Public pages:

- Home
- Blog
- Individual blog posts
- About
- Contact
- Privacy

Private owner tools:

- Dashboard
- Blog posts and drafts
- Photo management
- Homepage content
- Categories
- About content
- Contact messages
- Site settings

The public design uses the approved Laurel's Organized Chaos direction: black-first scrapbook styling with hot pink, purple, blue, and silver; crooked paper tabs; Polaroids; torn journal pieces; tarot-style panels; crows; owls; moons; stars; crystals; tape; staples; and hand-drawn details.

## Technology

- React 19
- TanStack Start / TanStack Router
- TypeScript
- Vite
- Supabase authentication, PostgreSQL, and storage
- TipTap rich-text editor
- Tailwind CSS / shadcn-style UI components

## Local development

Bun is recommended because this repository includes a Bun lockfile.

```sh
git clone https://github.com/laurelwebb1131/LaurelsOrganizedChaosBlog.git
cd LaurelsOrganizedChaosBlog
bun install
cp .env.example .env
bun run dev
```

Fill in the Supabase values in `.env` before using authentication, the admin area, database content, or image uploads.

Required environment variables:

```env
SUPABASE_PROJECT_ID=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
```

Never commit the real `.env` file.

## Useful commands

```sh
bun run dev
bun run build
bun run lint
bun run format
```

Every push to `main` also runs the free GitHub Actions validation workflow.

## Database

The Supabase schema migrations from the working Version 1 app are preserved under:

```
supabase/migrations/
```

They include the blog/CMS tables, owner authorization rules, storage access, and the public-read permission fix that allows published posts and visible photos to appear for logged-out visitors.

## Current maintenance status

- GitHub build: passing
- GitHub lint: passing
- Published post/photo public visibility: fixed in the source snapshot
- New/Edit Post routing: fixed
- Draft reopening race between Supabase and TipTap: fixed in this repository
- Real production deployment: not performed yet

## Repository history

This repository is intentionally separate from the older `LaurelsOrganizedChaos` GitHub repository. The older repository contains unrelated earlier work and was not overwritten.

The Lovable project remains available as a visual/reference build, but GitHub is now the working source for continued no-credit development.
