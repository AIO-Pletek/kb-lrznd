import Link from "next/link";
import { BookOpen, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-bold text-lg text-[var(--text-primary)]"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-[var(--radius)] bg-[var(--accent)] text-white">
                <BookOpen size={16} />
              </span>
              Kabe
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Platform knowledge base internal untuk dokumentasi, panduan,
              dan berbagi pengetahuan tim — kabe.lrznd.my.id
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
              Navigasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Semua Artikel
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Cari
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Tentang KB
                </Link>
              </li>
            </ul>
          </div>

          {/* CMS Link + Colophon */}
          <div>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
              Admin
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  Admin Panel →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Kabe — kabe.lrznd.my.id</p>
          <p className="flex items-center gap-1">
            Powered by Next.js · Directus · Docker
          </p>
        </div>
      </div>
    </footer>
  );
}
