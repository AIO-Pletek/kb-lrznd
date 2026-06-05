# Kabe — Knowledge Base Platform

Platform knowledge base internal untuk dokumentasi, panduan, dan berbagi pengetahuan antar tim. Dibangun dengan **Next.js 15**, **Directus CMS**, **PostgreSQL**, dan **Docker Compose**. Live di **[kabe.lrznd.my.id](https://kabe.lrznd.my.id)**.

## ✨ Fitur

- 📝 **CMS Directus** — Tulis dan kelola artikel dengan UI yang mudah
- 🔍 **Pencarian** — Cari artikel berdasarkan judul, konten, kategori, atau tag
- 🏷️ **Kategori & Tag** — Organisir konten secara rapi
- 🎨 **UI Modern** — Desain editorial premium, responsive, dark/light mode
- 📱 **Responsive** — Optimal di desktop, tablet, dan mobile
- 🐳 **Docker Ready** — Jalan dengan satu perintah `docker compose up -d`
- ⚡ **SSR + ISR** — Server-side rendering dengan incremental static regeneration

## 🚀 Quick Start

### Prasyarat

- Docker & Docker Compose v2
- (Opsional: Node.js 20+ untuk development lokal)

### 1. Clone & Setup Environment

```bash
cp .env.example .env
# Edit .env — ganti semua password dan secret key
```

### 2. Jalankan dengan Docker Compose

```bash
docker compose up -d
```

### 3. Akses

| Service | URL |
|---------|-----|
| Web KB | http://localhost (dev) / https://kabe.lrznd.my.id |
| CMS Directus | http://localhost/cms/admin (dev) / https://kabe.lrznd.my.id/cms/admin |
| Meilisearch | http://localhost:7700 (internal) |

### 4. Setup Awal CMS

1. Buka http://localhost/cms/admin (atau https://kabe.lrznd.my.id/cms/admin di production)
2. Login dengan email & password dari `.env` (`DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD`)
3. Buat collections sesuai panduan di [docs/CMS_SETUP.md](docs/CMS_SETUP.md)

## 📁 Struktur Project

```
kabe/
├── apps/web/            # Next.js frontend
│   ├── app/             # App Router pages & layouts
│   ├── components/      # UI components
│   ├── lib/             # Directus client, API, types, utils
│   └── styles/          # Global CSS
├── docker/caddy/        # Caddy reverse proxy config
├── docs/                # Dokumentasi
│   ├── CMS_SETUP.md     # Setup Directus collections
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── CONTENT_GUIDE.md # Panduan menulis konten
├── docker-compose.yml   # Docker Compose config
├── .env.example         # Template environment variables
└── README.md
```

## 🛠️ Development

### Frontend (Next.js)

```bash
cd apps/web
cp ../.env .env.local
npm install
npm run dev
# Akses di http://localhost:3000
```

Pastikan service Directus dan PostgreSQL sudah jalan via Docker:

```bash
docker compose up -d postgres directus
```

### Build Production

```bash
cd apps/web
npm run build
npm start
```

## 🔐 Keamanan

- **Semua secret** disimpan di `.env` (tidak di-hardcode)
- `.gitignore` sudah dikonfigurasi untuk mengecualikan `.env`
- **Internal deployment** direkomendasikan: VPN, private network, atau basic auth reverse proxy
- Lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) untuk opsi pengamanan akses

## 📚 Dokumentasi Lengkap

- [CMS Setup Guide](docs/CMS_SETUP.md) — Setup collections dan schema Directus
- [Deployment Guide](docs/DEPLOYMENT.md) — Production deployment & security options
- [Content Guide](docs/CONTENT_GUIDE.md) — Panduan menulis dan format konten

## 🏗️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 3 |
| CMS | Directus (headless) |
| Database | PostgreSQL 16 |
| Search | Directus search + Meilisearch (opsional) |
| Reverse Proxy | Caddy |
| Deployment | Docker Compose |

## 📄 Lisensi

Internal use only — project ini dibuat untuk penggunaan internal tim.
