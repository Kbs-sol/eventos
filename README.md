# EventOS — Config-Driven White-Label Event Management Platform

A professional-grade, fully white-label event management website built as a pnpm monorepo.
Change `brand.config.ts`, swap logo assets, deploy — instant rebrand.

## Live Preview

- **Web**: [Sandbox URL](https://3000-ikr9dh33v8igv33y7xksk-b9b802c4.sandbox.novita.ai)

---

## Features

### Completed
- **White-label engine**: `brand.config.ts` controls ALL branding — colors, fonts, content, sections, feature flags
- **CSS token system**: `theme.ts` generates CSS variables consumed by Tailwind
- **Layout variant system**: `classic` / `editorial` / `modern` / `minimal` resolved at runtime
- **Section visibility**: Config defaults + DB overrides + admin toggle UI
- **12-table Supabase schema** with full RLS (Row Level Security)
- **Hono API** with 10 route modules, Zod validation, JWT auth middleware
- **Professional public site** (Astro 4):
  - Full-screen animated hero with eyebrow badge
  - Services grid with icon mapping and feature lists
  - Why Choose Us section with animated icons
  - Stats counter section with scroll-triggered animation
  - Story/About section with decorative cards
  - Mission & Vision cards
  - Testimonials carousel with auto-advance
  - Featured portfolio grid with category filters
  - Contact form with 7 fields + success animation
  - Responsive navbar with mobile drawer
  - Footer with social links and contact info
  - WhatsApp floating button with tooltip
  - Scroll-reveal animations (IntersectionObserver)
- **Admin panel** (React + Vite + Tailwind):
  - Protected routes with Supabase auth
  - Dashboard with maturity score ring, quick actions, and enquiry list
  - Sections toggle page (per-page grouping)
  - Hero slides CRUD with modal forms
  - Portfolio events CRUD with visibility/featured toggles
  - Testimonials CRUD with star rating picker
  - Team members CRUD
  - Stats editor with live preview
  - Services manager (config + DB overrides)
  - Enquiries list with star/status filters and detail modal
  - Media library (grid/list views)
  - Settings page (4 tabs: General, Brand, Features, Environment)
  - Login page with split layout
- **Supabase DB queries** for all 12 tables (typed, paginated)
- **R2 upload utility** for media storage
- **Razorpay integration** (optional, flag-gated)
- **Resend email integration** for contact notifications

### Not Yet Implemented
- Blog system (flag exists, no pages yet)
- Dark mode toggle
- Cookie consent banner
- Awards / Press sections
- Image lightbox modal
- Video showreel player (placeholder only)
- Production deployment configs
- E2E tests

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Public site | Astro 4 + React islands + Tailwind CSS |
| API | Hono 4 on Cloudflare Workers |
| Admin panel | React 18 + Vite + Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Cloudflare R2 |
| Email | Resend |
| Payments | Razorpay (optional) |
| Monorepo | pnpm workspaces |
| Language | TypeScript (strict) |

---

## Project Structure

```
eventos/
├── brand.config.ts              # THE source of truth for all branding
├── packages/
│   ├── config/                  # Re-exports config + theme.ts + types
│   └── db/                      # Supabase client + typed queries
├── apps/
│   ├── web/                     # Astro public site
│   │   └── src/
│   │       ├── components/
│   │       │   ├── shared/      # ContactForm, StatCounter, etc.
│   │       │   └── variants/    # classic/, editorial/, modern/, minimal/
│   │       ├── layouts/
│   │       ├── lib/
│   │       ├── pages/
│   │       └── styles/
│   ├── api/                     # Hono API
│   │   └── src/
│   │       ├── routes/          # 10 route modules
│   │       ├── middleware/      # auth, cors, rateLimit
│   │       └── lib/             # r2, razorpay, resend
│   └── admin/                   # React admin panel
│       └── src/
│           ├── components/      # ui/, layout/, shared/
│           ├── pages/           # 12 pages
│           └── lib/             # api, auth, upload
├── supabase/migrations/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── SYSTEM.md
└── README.md
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start web (port 3000)
cd apps/web && npx astro dev --port 3000

# Start API (port 8787)
cd apps/api && npx wrangler dev --port 8787

# Start admin (port 5173)
cd apps/admin && npx vite --port 5173

# Build all
pnpm -r build
```

---

## Rebranding

1. Edit `brand.config.ts` — update company info, colors, fonts, feature flags
2. Replace images in `apps/web/public/brand/` — logo-light.svg, logo-dark.svg, favicon.ico, og-image.jpg
3. Run `supabase/migrations/001_initial.sql` on your Supabase project
4. Deploy

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/sections` | No | All section configs |
| GET | `/hero` | No | Visible hero slides |
| GET | `/portfolio` | No | Visible portfolio events |
| GET | `/testimonials` | No | Visible testimonials |
| GET | `/team` | No | Visible team members |
| GET | `/stats` | No | Stat overrides |
| POST | `/contact` | No | Submit contact enquiry |
| PATCH | `/admin/sections/:id` | Yes | Toggle section visibility |
| CRUD | `/admin/hero/*` | Yes | Hero slides management |
| CRUD | `/admin/portfolio/*` | Yes | Portfolio CRUD |
| CRUD | `/admin/testimonials/*` | Yes | Testimonials CRUD |
| CRUD | `/admin/team/*` | Yes | Team CRUD |
| CRUD | `/admin/enquiries/*` | Yes | Enquiry management |
| POST | `/admin/upload` | Yes | File upload to R2 |

---

## Data Models

See `packages/db/types.ts` for full TypeScript interfaces:
- `SectionConfig`, `HeroSlide`, `PortfolioEvent`, `PortfolioImage`
- `ServiceOverride`, `Testimonial`, `TeamMember`, `StatOverride`
- `ContactEnquiry`, `MediaAsset`, `SiteSetting`, `Booking`

---

## Environment Variables

See `SYSTEM.md` for the complete list of required environment variables for each app.

---

## Deployment Status

- **Platform**: Cloudflare Pages (web + admin) + Cloudflare Workers (API)
- **Status**: Development / Ready for production deployment
- **Last Updated**: 2026-03-22
