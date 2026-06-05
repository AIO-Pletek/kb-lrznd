import Link from "next/link";
import type { Category } from "@/lib/types";

// Simple emoji icon mapping — bisa di-override dari CMS icon field
const FALLBACK_ICONS: Record<string, string> = {
  default: "📚",
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const icon = category.icon || FALLBACK_ICONS.default;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card p-6 group flex flex-col items-start gap-4 hover:border-[var(--accent)]/30"
    >
      {/* Icon */}
      <span className="text-3xl" role="img" aria-hidden="true">
        {icon}
      </span>

      {/* Content */}
      <div>
        <h3 className="font-display font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <span className="mt-auto text-xs font-medium text-[var(--accent)] flex items-center gap-1">
        Lihat artikel →
      </span>
    </Link>
  );
}
