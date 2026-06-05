import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
        <FileQuestion size={36} className="text-[var(--text-muted)]" />
      </div>
      <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-3">
        404 — Halaman tidak ditemukan
      </h1>
      <p className="text-[var(--text-secondary)] max-w-sm mb-8">
        Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
        <Link href="/articles" className="btn-outline">
          Lihat Artikel
        </Link>
      </div>
    </div>
  );
}
