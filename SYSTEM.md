# SYSTEM.md — EventOS Architecture & Absolute Rules

> This file documents the architecture, conventions, and absolute rules
> that govern this monorepo. Every contributor MUST read this before touching code.

---

## 1. Single Source of Truth

**`brand.config.ts`** is the ONLY file that changes when rebranding.

- All colors, fonts, company info, section defaults, content strings,
  feature flags, and layout variants live here.
- **NO hardcoded colors, font names, company names, or toggles** anywhere else.
- Components read from `@eventos/config`, which re-exports `brand.config.ts`.

---

## 2. Monorepo Structure

```
eventos/
├── brand.config.ts              ← Single source of truth
├── packages/
│   ├── config/                  ← Re-exports brand.config + theme.ts + types
│   └── db/                      ← Supabase client, typed queries, types
├── apps/
│   ├── web/                     ← Astro 4 public site (SSR on Cloudflare)
│   ├── api/                     ← Hono API on Cloudflare Workers
│   └── admin/                   ← React + Vite admin panel
├── supabase/
│   └── migrations/001_initial.sql
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## 3. Technology Stack

| Layer       | Technology                  | Notes                            |
| ----------- | --------------------------- | -------------------------------- |
| Public site | Astro 4 + React islands     | SSR via `@astrojs/cloudflare`    |
| API         | Hono 4 on Cloudflare Workers| Zod validation, JWT auth         |
| Admin       | React 18 + Vite + TailwindCSS| SPA with `react-router-dom`    |
| Database    | Supabase (PostgreSQL)       | RLS enabled on all tables        |
| Storage     | Cloudflare R2               | Images served via public URL     |
| Email       | Resend                      | Contact form notifications       |
| Payments    | Razorpay (optional)         | Booking deposits when enabled    |
| Styling     | CSS custom properties       | Generated from `brand.config`    |
| Workspace   | pnpm 10 workspaces          | Strict workspace protocol        |

---

## 4. CSS Token System

`packages/config/theme.ts` generates `:root` CSS variables from `brand.config.brand`:

- `--color-primary`, `--color-secondary`, `--color-accent`, etc.
- `--font-display`, `--font-body`, `--font-accent`
- `--radius-card`, `--radius-button`
- `--shadow-card`, `--shadow-button`
- `--transition-base`, `--animation-level`

`apps/web/tailwind.config.mjs` maps these to Tailwind classes.
Components use `var(--color-primary)` inline or Tailwind's `text-primary` etc.

---

## 5. Layout Variant System

- `brand.config.brand.layout.variant` = `'classic' | 'editorial' | 'modern' | 'minimal'`
- `SectionResolver.astro` dynamically imports `./variants/{variant}/index.ts`
- Each variant folder exports named section components.
- Classic is fully implemented; other variants fall back to classic.

---

## 6. Section Visibility

1. **Config defaults**: `brand.config.sections.{page}.{key}` → boolean
2. **DB overrides**: `section_config` table rows override defaults
3. **Admin toggles**: PATCH `/admin/sections/:sectionId` → updates DB
4. **Runtime merge**: `mergeSectionVisibility(page, dbOverrides)`

---

## 7. Database Schema

12 tables with RLS enabled:
- `section_config` — page section visibility toggles
- `hero_slides` — homepage hero carousel
- `portfolio_events` / `portfolio_images` — event gallery
- `services_override` — admin overrides for config services
- `testimonials` — client quotes
- `team_members` — team grid
- `stats_override` — admin overrides for stat counters
- `contact_enquiries` — form submissions
- `media_assets` — R2-backed file registry
- `site_settings` — key-value pairs
- `bookings` — Razorpay payment records

---

## 8. API Routes

### Public (no auth)
| Method | Path                         | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/health`                    | Health check          |
| GET    | `/sections`                  | All section configs   |
| GET    | `/sections/page/:page`       | Page section map      |
| GET    | `/portfolio`                 | Visible events        |
| GET    | `/hero`                      | Visible hero slides   |
| GET    | `/testimonials`              | Visible testimonials  |
| GET    | `/team`                      | Visible members       |
| GET    | `/stats`                     | Stat overrides        |
| POST   | `/contact`                   | Submit enquiry        |

### Admin (Bearer token required)
All CRUD operations under `/admin/*` — sections, hero, portfolio,
testimonials, team, stats, enquiries, upload, settings.

---

## 9. Absolute Rules

1. **No hardcoded values**: Every color, font, name, toggle comes from `brand.config.ts`.
2. **Strict TypeScript**: All files use `.ts` / `.tsx`; no `any` unless absolutely necessary.
3. **RLS always on**: Every Supabase table has Row Level Security enabled.
4. **Workspace imports**: Always import `@eventos/config`, never `../../brand.config`.
5. **CSS variables first**: Use `var(--color-*)` in styles, not hex codes.
6. **Mobile-first**: All components must be responsive and touch-friendly.
7. **Semantic HTML**: Use proper heading hierarchy, ARIA labels, alt text.
8. **No inline secrets**: API keys go in `.env` / `.dev.vars` / Cloudflare secrets.

---

## 10. Environment Variables

### apps/web (.env)
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_API_URL=
```

### apps/api (wrangler secrets)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_EMAIL=
RAZORPAY_KEY_ID= (optional)
RAZORPAY_KEY_SECRET= (optional)
```

### apps/admin (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
VITE_R2_PUBLIC_URL=
```

---

## 11. Build Order

```
1. root setup (pnpm install)
2. brand.config.ts
3. packages/config
4. packages/db
5. supabase migration
6. apps/api
7. apps/web
8. apps/admin
```

---

## 12. Deployment

- **Web**: `cd apps/web && astro build` → deploy `dist/` to Cloudflare Pages
- **API**: `cd apps/api && wrangler deploy` → Cloudflare Workers
- **Admin**: `cd apps/admin && vite build` → deploy `dist/` (Cloudflare Pages / Vercel / Netlify)
- **Database**: `supabase db push` or run migration SQL in Supabase dashboard
