import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { ArticleListItem } from "@/lib/types";
import { formatRelativeDate, cn } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleListItem;
  variant?: "default" | "compact" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "article-card group block",
        isFeatured && "md:grid md:grid-cols-2 md:gap-6 md:p-0 md:overflow-hidden"
      )}
    >
      {/* Featured image */}
      {isFeatured && article.featured_image && (
        <div className="hidden md:block relative min-h-[240px] bg-[var(--bg-tertiary)]">
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || "/cms"}/assets/${article.featured_image}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className={cn(isFeatured && "md:p-8 md:flex md:flex-col md:justify-center")}>
        {/* Meta row */}
        <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] mb-3">
          {article.category && (
            <span className="chip text-xs">{article.category.name}</span>
          )}
          {article.reading_time && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.reading_time} menit baca
            </span>
          )}
          {article.published_at && (
            <span>{formatRelativeDate(article.published_at)}</span>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-display font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2",
            isFeatured ? "text-2xl md:text-3xl" : "text-lg"
          )}
        >
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3">
            {article.summary}
          </p>
        )}

        {/* Author + Read more */}
        <div className="flex items-center justify-between mt-auto">
          {article.author && (
            <div className="flex items-center gap-2">
              {article.author.avatar ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || "/cms"}/assets/${article.author.avatar}`}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover bg-[var(--bg-tertiary)]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <span className="text-xs text-[var(--text-secondary)]">
                {article.author.name}
              </span>
            </div>
          )}

          <span className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            Baca <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
