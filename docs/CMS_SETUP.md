# CMS Setup — Directus Collections

Panduan setup collections di Directus untuk Kabe (kabe.lrznd.my.id).

## Prasyarat

- Directus sudah berjalan (`docker compose up -d directus`)
- Sudah login ke admin panel di `/cms/admin`

---

## 1. Buat Collections

Buka **Settings → Data Model** dan buat 4 collections berikut.

### 1.1 Collection: `categories`

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `id` | UUID (auto) | ✅ | Primary key |
| `name` | String | ✅ | |
| `slug` | String | ✅ | Slugify from name |
| `description` | Text | ❌ | |
| `icon` | String | ❌ | Emoji atau icon name |
| `sort` | Integer | ❌ | Default: 0 |

**Settings:**
- Collection naming: `categories` (plural)
- Sort field: `sort`
- Sort direction: Ascending

### 1.2 Collection: `tags`

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `id` | UUID (auto) | ✅ | Primary key |
| `name` | String | ✅ | |
| `slug` | String | ✅ | Slugify from name |

**Settings:**
- Collection naming: `tags` (plural)

### 1.3 Collection: `authors`

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `id` | UUID (auto) | ✅ | Primary key |
| `name` | String | ✅ | |
| `role` | String | ❌ | Contoh: "Backend Engineer" |
| `avatar` | Image | ❌ | |

**Settings:**
- Collection naming: `authors` (plural)

### 1.4 Collection: `articles`

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `id` | UUID (auto) | ✅ | Primary key |
| `status` | Enum (String) | ✅ | Values: `draft`, `published`, `archived`. Default: `draft` |
| `title` | String | ✅ | |
| `slug` | String | ✅ | Slugify from title, unique |
| `summary` | Text | ❌ | Short description (1-2 kalimat) |
| `content` | Markdown | ❌ | Konten artikel dalam Markdown |
| `category` | M2O → `categories` | ❌ | Many-to-One relationship |
| `tags` | M2M → `tags` | ❌ | Many-to-Many relationship |
| `author` | M2O → `authors` | ❌ | Many-to-One relationship |
| `featured_image` | Image | ❌ | Gambar utama artikel |
| `is_featured` | Boolean | ❌ | Default: false |
| `published_at` | DateTime | ❌ | Tanggal publish |
| `updated_at` | DateTime | ❌ | Auto-update on edit |

**Settings:**
- Collection naming: `articles` (plural)
- Sort field: `published_at`
- Sort direction: Descending

---

## 2. Relasi Antar Collection

```
articles ──M:1──→ categories
articles ──M:1──→ authors
articles ──M:M──→ tags
```

## 3. Public Access (Frontend API)

Agar Next.js frontend bisa membaca data tanpa autentikasi:

1. **Settings → Roles & Permissions**
2. Klik role **Public**
3. Set permissions untuk setiap collection:
   - **articles**: Read only — tambahkan filter: `status` equals `published`
   - **categories**: Read only — semua field
   - **tags**: Read only — semua field
   - **authors**: Read only — semua field (name, role, avatar)
4. **Save** perubahan

Dengan ini, frontend Next.js bisa fetch artikel published tanpa login.

## 4. Verifikasi

1. Buat 1 category, 1 author, dan 1 tag
2. Buat 1 artikel dengan status `published`
3. Buka browser di `/api/cms/items/articles` → harus muncul data JSON artikel
4. Buka frontend web → artikel harus muncul

## 5. Tips

- **Slug** harus URL-friendly: lowercase, tanpa spasi, gunakan `-` sebagai separator
- **Featured image**: upload gambar dengan format yang sama untuk konsistensi (disarankan 1200×630)
- **Markdown content**: bisa pakai heading (`##`, `###`), code blocks, images, links, tables, dll
- **Sort categories**: isi field `sort` untuk mengatur urutan tampil di frontend (0 = paling atas)

---

## Troubleshooting

**Artikel tidak muncul di frontend?**
- Pastikan status artikel = `published`
- Pastikan Public role punya Read permission di collection articles
- Cek filter Public role: `status` = `published`
- Cek CORS setting di Directus (`.env` → `CORS_ENABLED=true`, `CORS_ORIGIN=*`)

**Gambar tidak muncul?**
- Pastikan `DIRECTUS_PUBLIC_URL` di `.env` sesuai dengan base URL yang diakses
- Cek apakah file sudah terupload di **File Library** Directus
