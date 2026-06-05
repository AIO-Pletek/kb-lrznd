import { FileQuestion, SearchX } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type?: "search" | "general";
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  type = "general",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const defaults = {
    search: {
      icon: SearchX,
      title: "Tidak ada hasil",
      description:
        "Coba kata kunci lain atau jelajahi kategori yang tersedia.",
      actionLabel: "Lihat Semua Artikel",
      actionHref: "/articles",
    },
    general: {
      icon: FileQuestion,
      title: "Belum ada konten",
      description: "Belum ada artikel yang tersedia di sini.",
      actionLabel: "Kembali ke Beranda",
      actionHref: "/",
    },
  };

  const config = type === "search" ? defaults.search : defaults.general;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-5">
        <Icon size={28} className="text-[var(--text-muted)]" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
        {description || config.description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
