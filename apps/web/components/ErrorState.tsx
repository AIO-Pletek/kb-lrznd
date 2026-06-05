import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ErrorState({
  title = "Gagal memuat",
  description = "Terjadi kesalahan saat mengambil data. Coba muat ulang halaman.",
  actionLabel = "Muat Ulang",
  actionHref,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mb-5">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {actionHref ? (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      ) : (
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
