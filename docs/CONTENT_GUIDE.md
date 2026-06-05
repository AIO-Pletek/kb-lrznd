# Content Guide — Menulis Artikel di Kabe

Panduan menulis dan memformat konten artikel untuk Kabe (kabe.lrznd.my.id).

---

## Format Konten

Artikel ditulis dalam format **Markdown** — format teks ringan yang mudah dibaca dan dikonversi ke HTML.

### Heading

Gunakan `##` (H2) dan `###` (H3) untuk struktur artikel. Heading otomatis muncul di Table of Contents.

```markdown
## Instalasi

### Prasyarat

### Langkah 1: Clone Repository
```

> **Note**: Jangan gunakan `#` (H1) — judul artikel sudah jadi H1 otomatis.

### Text Formatting

```markdown
**Bold** — untuk penekanan
*Italic* — untuk istilah asing
`inline code` — untuk perintah, variable, nama file
~~strikethrough~~ — untuk informasi yang sudah tidak berlaku
```

### Lists

```markdown
- Item 1
- Item 2
  - Sub item 2.1
  - Sub item 2.2

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga
```

### Code Blocks

Gunakan triple backtick dengan language hint:

````markdown
```javascript
const config = {
  port: 3000,
  host: "kabe.lrznd.my.id",
};
```
````

Untuk shell commands:

````markdown
```bash
npm install
npm run dev
```
````

### Links

```markdown
[Internal link ke artikel lain](/articles/nama-slug)
[External link](https://example.com)
```

### Images

Upload gambar via Directus File Library, lalu embed di artikel:

```markdown
![Deskripsi gambar](/cms/assets/<file-id>)
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Blockquotes

```markdown
> **⚠️ Perhatian:** Pastikan environment variable sudah diset sebelum menjalankan perintah ini.
```

Gunakan untuk:
- Catatan penting / warning
- Tips dan best practice
- Informasi tambahan

### Horizontal Rule

```markdown
---
```

---

## Struktur Artikel yang Baik

### 1. Artikel Panduan / Tutorial

```markdown
## Overview
Jelaskan tujuan dan apa yang akan dicapai.

## Prasyarat
Sebutkan yang dibutuhkan sebelum memulai.

## Langkah-langkah
### 1. Langkah Pertama
### 2. Langkah Kedua
...

## Verifikasi
Cara cek apakah panduan berhasil diikuti.

## Troubleshooting
Masalah umum dan solusinya.
```

### 2. Artikel Dokumentasi / Referensi

```markdown
## Overview
Definisi dan konteks.

## Konsep Utama
### Sub-konsep 1
### Sub-konsep 2

## Cara Menggunakan
Contoh penggunaan.

## Best Practices
Tips dan rekomendasi.

## Related
Link ke artikel terkait.
```

### 3. Artikel SOP / Proses

```markdown
## Tujuan
Kenapa SOP ini ada.

## Scope
Siapa dan kapan berlaku.

## Prosedur
### 1. ...
### 2. ...

## Exceptions
Kapan tidak mengikuti SOP ini.

## Changelog
Riwayat perubahan SOP.
```

---

## Tips Menulis

### Judul
- Spesifik dan deskriptif
- Contoh baik: "Setup PostgreSQL Replication untuk Production"
- Contoh kurang: "Database Setup"

### Summary
- 1-2 kalimat menjelaskan isi artikel
- Bisa pakai kalimat tanya: "Bagaimana cara...?"
- Akan muncul di card preview dan SEO

### Slug
- URL-friendly: huruf kecil, tanpa spasi
- Gunakan `-` sebagai separator
- Otomatis dibuat dari judul, bisa diedit manual
- Contoh: `setup-postgresql-replication`

### Konten
- Mulai dengan overview / konteks
- Gunakan heading untuk struktur
- Beri contoh kode yang konkret
- Tambahkan screenshot jika membantu
- Akhiri dengan link ke artikel terkait

### Kategori & Tag

- **Kategori**: pilih 1 per artikel (Backend, Frontend, DevOps, dll.)
- **Tag**: bisa multiple, lebih spesifik (postgresql, docker, ci-cd, monitoring)

---

## Contoh Artikel

```markdown
## Overview

Panduan setup development environment untuk project backend Go di laptop baru.
Mencakup instalasi Go, dependency management, dan konfigurasi editor.

## Prasyarat

- macOS / Linux / WSL2
- Terminal (iTerm2 / Windows Terminal)
- Homebrew (macOS)

## Langkah-langkah

### 1. Install Go

```bash
# macOS
brew install go@1.22

# Linux
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
```

Verifikasi:

```bash
go version
# go version go1.22.0 darwin/arm64
```

### 2. Setup GOPATH

Tambahkan ke `~/.zshrc` atau `~/.bashrc`:

```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

### 3. Konfigurasi VS Code

Install extension:
- Go (golang.go)
- Error Lens

## Verifikasi

Jalankan hello world:

```bash
mkdir -p ~/hello && cd ~/hello
go mod init hello
echo 'package main; import "fmt"; func main() { fmt.Println("Hello, KB!") }' > main.go
go run main.go
```

## Troubleshooting

**`go: command not found`**
Pastikan PATH sudah diset dengan benar. Restart terminal setelah edit config.

**`GOPATH not set`**
Tambahkan environment variable GOPATH sesuai langkah 2 di atas.

---

## Related Articles

- [Go Project Structure](/articles/go-project-structure)
- [Docker untuk Go Development](/articles/docker-go-dev)
```
