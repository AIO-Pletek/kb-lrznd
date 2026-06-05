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

# Jalankan backend services aja (Directus + PostgreSQL) via Docker
docker compose up -d postgres directus

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
| CMS Directus | http://localhost/cms/admin | https://kabe.lrznd.my.id/cms/admin |
| Meilisearch | http://localhost:7700 (internal) | (internal only) |

## Architecture

### Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 3
- **CMS:** Directus (headless, connect ke PostgreSQL)
- **Database:** PostgreSQL 16
- **Search:** Directus API search + Meilisearch (opsional, belum full sync)
- **Reverse Proxy:** Caddy
- **Deployment:** Docker Compose

### Struktur Project

```
kb-lrznd/
├── apps/web/             # Next.js frontend (monorepo-style)
│   ├── app/              # App Router pages
│   │   ├── layout.tsx    # Root layout (Header, Footer, ThemeProvider)
│   │   ├── page.tsx      # Home page
│   │   ├── articles/     # /articles, /articles/[slug]
│   │   ├── categories/   # /categories, /categories/[slug]
│   │   ├── search/       # /search
│   │   ├── about/        # /about
│   │   └── globals.css   # Global styles + Tailwind directives
│   ├── components/       # Reusable UI components (14 components)
│   ├── lib/
│   │   ├── directus.ts   # Directus SDK client init (server-side)
│   │   ├── api.ts        # Semua data-fetching functions
│   │   ├── types.ts      # TypeScript interfaces
│   │   └── utils.ts      # Utility: reading time, dates, cn(), slugify, asset URL
│   ├── Dockerfile        # Multi-stage build → standalone output
│   └── package.json
├── docker/caddy/         # Caddy reverse proxy config
├── docs/                 # CMS_SETUP.md, DEPLOYMENT.md, CONTENT_GUIDE.md
├── docker-compose.yml    # 5 services: postgres, directus, meilisearch, web, caddy
├── .env.example          # Template environment variables
└── README.md
```

### Data Flow

1. **CMS → Frontend:** Next.js server-side (RSC) fetch data dari Directus API via `@directus/sdk` pakai internal Docker network (`http://directus:8055`)
2. **Routing:** Caddy reverse proxy — `/cms/*` ke Directus, sisanya ke Next.js `web:3000`
3. **Static Generation:** `next.config.ts` pakai `output: "standalone"` untuk Docker. ISR/SSG slugs di-generate dari `getAllArticleSlugs()` dan `getAllCategorySlugs()` di `lib/api.ts`
4. **Images:** Directus assets di-proxy melalui Caddy (`/cms/assets/...`). Next.js `next.config.ts` allowlisted `directus:8055` dan domain production

### Key Patterns

**Data Fetching (`lib/api.ts`):**
- Semua query ke Directus pakai `directus.request(readItems(...))` pattern (SDK v17)
- Semua function return empty array/null on error (fail-safe, no crash)
- `fetchArticles()` support filtering: category, tag, search, sort, featured, pagination
- Pagination meta di-estimasi (SDK v17 ga return total count by default)

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
| `DIRECTUS_KEY`, `DIRECTUS_SECRET` | Directus |
| `DIRECTUS_ADMIN_EMAIL`, `DIRECTUS_ADMIN_PASSWORD` | Directus initial admin |
| `DIRECTUS_PUBLIC_URL` | Public URL Directus via proxy |
| `MEILI_MASTER_KEY` | Meilisearch auth |
| `SITE_URL` | Public site URL (production: `https://kabe.lrznd.my.id`) |
| `DIRECTUS_URL` | Internal Directus URL (auto-set di docker-compose) |

### Search Implementation

Saat ini search pakai Directus API filter `_icontains` (case-insensitive partial match). Meilisearch sudah ada di stack tapi belum full sync. Kalau butuh implementasi Meilisearch sync, hook ke Directus webhook atau cron job — jangan overwrite search yang sudah jalan.
