# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Instructions

Always answer in Indonesian casual technical style.

For this project, use the skill:

`D:\myproject\kb-lrznd\SKILL.md`

Main project goal:

Build an internal Knowledge Base website ("Kabe") dengan CMS-driven articles, Docker deployment, modern original UI inspired by premium editorial/awwwards-style websites — live di domain **kabe.lrznd.my.id**. Jangan clone atau copy copyrighted design dari situs manapun.

Core rules:

- Think before coding.
- Simplicity first.
- Surgical changes only.
- Convert ambiguous instructions into verifiable goals.
- Do not hardcode secrets.
- Use environment variables.
- Prioritize production-ready Docker setup.

## Commands

Semua command dijalankan dari root project (`D:\myproject\kb-lrznd`) kecuali disebutkan lain.

### Development

```bash
# Frontend Next.js dev server (port 3000)
cd apps/web && npm run dev

# Jalankan backend service aja (PostgreSQL) via Docker
docker compose up -d postgres

# Jalankan semua service via Docker
docker compose up -d

# Lint
cd apps/web && npm run lint

# Build production
cd apps/web && npm run build

# Jalankan production build
cd apps/web && npm start
```

### Docker

```bash
# Start semua service
docker compose up -d

# Stop semua service
docker compose down

# Rebuild dan restart satu service (misal: web)
docker compose up -d --build web

# Lihat logs
docker compose logs -f
docker compose logs -f web     # logs spesifik service
```

### Akses Aplikasi

| Service | URL Local | URL Production |
|---------|-----------|----------------|
| Web KB | http://localhost | https://kabe.lrznd.my.id |
| Admin Panel | http://localhost/admin | https://kabe.lrznd.my.id/admin |

## Architecture

### Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 3
- **CMS:** Custom admin panel (built-in, `/admin`), Drizzle ORM
- **Auth:** iron-session (sealed cookie, single admin user)
- **Database:** PostgreSQL 16
- **Search:** PostgreSQL ILIKE via Drizzle queries
- **Reverse Proxy:** Nginx (eksternal, di luar Docker)
- **Deployment:** Docker Compose (2 services: postgres + web)

### Struktur Project

```
kb-lrznd/
├── apps/web/             # Next.js frontend + admin panel
│   ├── app/              # App Router pages
│   │   ├── layout.tsx    # Root layout (Header, Footer, ThemeProvider)
│   │   ├── page.tsx      # Home page
│   │   ├── articles/     # /articles, /articles/[slug]
│   │   ├── categories/   # /categories, /categories/[slug]
│   │   ├── search/       # /search
│   │   ├── about/        # /about
│   │   ├── admin/        # /admin (CMS built-in)
│   │   │   ├── login/    # Admin login page
│   │   │   ├── articles/ # Article list, new, edit
│   │   │   ├── categories/ # Category CRUD
│   │   │   ├── tags/     # Tag CRUD
│   │   │   └── authors/  # Author CRUD
│   │   ├── api/admin/    # Admin API routes (CRUD + upload)
│   │   └── globals.css   # Global styles + Tailwind directives
│   ├── components/       # Reusable UI components
│   ├── lib/
│   │   ├── db/           # Drizzle ORM (schema, client, migrations)
│   │   ├── auth.ts       # iron-session helpers
│   │   ├── api.ts        # Public data-fetching (Drizzle queries)
│   │   ├── types.ts      # TypeScript interfaces
│   │   └── utils.ts      # Utilities: reading time, dates, cn(), slugify, asset URL
│   ├── middleware.ts      # Admin route protection
│   ├── drizzle.config.ts # Drizzle-kit config
│   ├── Dockerfile        # Multi-stage build + migration runner
│   └── package.json
├── docker/nginx/         # Nginx reverse proxy config
├── docs/                 # Dokumentasi
├── docker-compose.yml    # 2 services: postgres, web
├── .env.example          # Template environment variables
└── README.md
```

### Data Flow

1. **Database → Frontend:** Next.js server-side (RSC) fetch data dari PostgreSQL via Drizzle ORM
2. **Routing:** Nginx reverse proxy (eksternal) — semua request ke Next.js `127.0.0.1:3000`
3. **Admin Panel:** `/admin/*` routes built-in ke Next.js app, dilindungi iron-session auth
4. **Static Generation:** `next.config.ts` pakai `output: "standalone"` untuk Docker. ISR/SSG slugs dari `getAllArticleSlugs()` dan `getAllCategorySlugs()` di `lib/api.ts`
5. **Images:** Uploaded files disimpan di `public/uploads/` (Docker volume), served langsung oleh Next.js

### Key Patterns

**Data Fetching (`lib/api.ts`):**
- Semua query ke PostgreSQL via Drizzle ORM (`db.query.articles.findMany(...)`)
- Semua function return empty array/null on error (fail-safe, no crash)
- `fetchArticles()` support filtering: category, tag, search, sort, featured, pagination
- Pagination meta di-estimasi (Drizzle query belum support total count)
- Data mapper transform Drizzle camelCase → Directus-style snake_case (kompatibilitas types)

**Styling:**
- Tailwind CSS dengan custom design tokens: `brand` (indigo-blue), `ink` (gray scale)
- Typography: Inter (body), Plus Jakarta Sans (display/heading)
- Fluid typography: `clamp()` values di `tailwind.config.ts`
- Dark mode: `class` strategy via `ThemeProvider` component
- Animations: `fade-in`, `slide-up`, `scale-in` custom keyframes

**Components:**
- Semua components di `apps/web/components/` bersifat reusable dan client-safe
- `ThemeProvider` wrapper dark/light mode toggle
- `MarkdownRenderer` pake `react-markdown` + `remark-gfm`
- `TableOfContents` extract heading dari konten markdown
- `EmptyState`, `LoadingSkeleton`, `ErrorState` untuk UX state handling

**Docker:**
- Multi-stage build: `node:20-alpine` builder → runner tanpa devDependencies
- Next.js standalone output → `node server.js`
- Non-root user (`nextjs`, uid 1001) di container
- Semua service di internal Docker network `kb-net`

### Environment Variables

Semua konfigurasi lewat environment variables (lihat `.env.example`). Key vars:

| Variable | Service |
|----------|---------|
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Admin login credentials |
| `SESSION_SECRET` | iron-session encryption key (min 32 chars) |
| `SITE_URL` | Public site URL (production: `https://kabe.lrznd.my.id`) |

### Database

Pakai Drizzle ORM dengan PostgreSQL. Schema didefinisikan di `lib/db/schema.ts`. Migration SQL manual di `lib/db/migrations/`. Migration dijalankan otomatis saat container start via `lib/db/run-migrate.mjs`.

Commands Drizzle:
```bash
cd apps/web
npm run db:generate   # Generate migration dari schema
npm run db:migrate    # Jalankan migrasi
npm run db:studio     # Drizzle Studio GUI
```

### Search Implementation

Search pakai PostgreSQL `ILIKE` via Drizzle `ilike()` operator. Case-insensitive partial match di field title, summary, content.
