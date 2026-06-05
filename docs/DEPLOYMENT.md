# Deployment Guide — Kabe

Panduan deployment Kabe (kabe.lrznd.my.id) ke production.

---

## Prasyarat Server

- **OS**: Ubuntu 22.04+ (atau Linux dengan Docker support)
- **CPU**: 1-2 core (minimum)
- **RAM**: 2GB+ (4GB recommended)
- **Disk**: 20GB+
- **Docker**: v24+
- **Docker Compose**: v2+

---

## 1. Quick Deploy

```bash
# Clone project
git clone <repo-url> kabe
cd kabe

# Setup env
cp .env.example .env
nano .env  # Edit semua password dan secret

# Jalankan
docker compose up -d

# Cek status
docker compose ps
```

Semua service harus dalam status `running` / `healthy`.

---

## 2. Konfigurasi Production

### 2.1 Environment Variables

Edit `.env` untuk production:

```bash
# --- Wajib diganti ---
DB_PASSWORD=<random-32-char>
DIRECTUS_KEY=<random-64-char>
DIRECTUS_SECRET=<random-64-char>
DIRECTUS_ADMIN_EMAIL=admin@perusahaan.com
DIRECTUS_ADMIN_PASSWORD=<strong-password>
MEILI_MASTER_KEY=<random-32-char>

# --- Sesuaikan dengan domain ---
SITE_URL=https://kabe.lrznd.my.id
DIRECTUS_PUBLIC_URL=https://kabe.lrznd.my.id/cms

# --- Caddy ---
CADDY_HTTP_PORT=80
CADDY_HTTPS_PORT=443
```

### 2.2 Caddy + HTTPS

Untuk production dengan HTTPS, edit `docker/caddy/Caddyfile`:

```caddy
kabe.lrznd.my.id {
    handle_path /cms/* {
        reverse_proxy directus:8055
    }

    handle {
        reverse_proxy web:3000
    }
}
```

Caddy otomatis mendapatkan sertifikat SSL dari Let's Encrypt jika domain publik.

---

## 3. Opsi Pengamanan Akses

Karena ini **internal KB**, ada beberapa opsi untuk membatasi akses:

### Opsi A: VPN / Private Network (Recommended)

- Deploy semua service di private network (VPC)
- Akses hanya via VPN kantor (WireGuard, OpenVPN, Tailscale)
- Tidak perlu auth tambahan — network sudah jadi barrier
- **Setup**: Jalankan Docker di server internal, expose port hanya di private interface

### Opsi B: Basic Auth via Caddy

Tambah basic auth di Caddy. Edit `Caddyfile`:

```caddy
kabe.lrznd.my.id {
    basicauth {
        tim <hashed-password>
    }

    handle_path /cms/* {
        reverse_proxy directus:8055
    }

    handle {
        reverse_proxy web:3000
    }
}
```

Generate hashed password:
```bash
docker compose exec caddy caddy hash-password --plaintext "password-anda"
```

### Opsi C: Cloudflare Zero Trust / Tunnel

- Pasang Cloudflare Tunnel di server
- Akses via Cloudflare Access dengan SSO
- Tidak perlu buka port publik

### Opsi D: IP Whitelist via Firewall

```bash
# Contoh: hanya izinkan IP kantor
ufw allow from 192.168.1.0/24 to any port 80
ufw allow from 192.168.1.0/24 to any port 443
ufw default deny incoming
```

---

## 4. Backup

### Database (PostgreSQL)

```bash
# Backup
docker compose exec postgres pg_dump -U kb_user kb_database > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T postgres psql -U kb_user kb_database < backup_20260101.sql
```

### Uploads (Directus)

```bash
# Backup
docker compose cp directus:/directus/uploads ./backups/uploads_$(date +%Y%m%d)/

# Atau backup seluruh volume
docker run --rm -v kabe_directus_uploads:/data -v $(pwd)/backups:/backup alpine tar czf /backup/uploads_$(date +%Y%m%d).tar.gz -C /data .
```

### Otomatisasi Backup

Tambahkan cron job di server:

```bash
# /etc/cron.d/kb-backup
0 2 * * * root cd /opt/kabe && docker compose exec -T postgres pg_dump -U kb_user kb_database > /backups/kb_$(date +\%Y\%m\%d).sql
0 3 * * 0 root find /backups -name "*.sql" -mtime +30 -delete
```

---

## 5. Maintenance

### Update Services

```bash
# Pull image terbaru
docker compose pull

# Restart dengan image baru
docker compose up -d

# Hapus image lama
docker image prune -f
```

### Monitoring

```bash
# Cek logs
docker compose logs -f --tail=100

# Cek resource usage
docker stats

# Cek health
docker compose ps
```

### Restart

```bash
docker compose restart
```

---

## 6. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `502 Bad Gateway` | Cek service web: `docker compose logs web` |
| CMS tidak bisa login | Cek `DIRECTUS_ADMIN_EMAIL` dan `DIRECTUS_ADMIN_PASSWORD` di `.env` |
| Artikel tidak muncul | Cek Public role permissions di Directus Settings |
| Database connection error | Cek service postgres healthy: `docker compose ps` |
| Port already in use | Ganti `CADDY_HTTP_PORT` di `.env` |
| Caddy SSL error | Pastikan domain resolve ke server; cek port 80/443 terbuka |

---

## 7. Checklist Go-Live

- [ ] `.env` semua password & secret sudah diganti dari default
- [ ] Domain / URL sudah dikonfigurasi di `Caddyfile` dan `.env`
- [ ] SSL berfungsi (jika domain publik)
- [ ] Public role permission di Directus sudah disetel
- [ ] Minimal 1 artikel sudah dibuat & muncul di frontend
- [ ] Backup routine sudah dikonfigurasi
- [ ] Akses sudah dibatasi (VPN / basic auth / firewall)
- [ ] `.gitignore` sudah mengecualikan `.env`
