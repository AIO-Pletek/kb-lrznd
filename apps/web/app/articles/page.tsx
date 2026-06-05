import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ArticleCard } from "@/components/ArticleCard";
import { TagBadge } from "@/components/TagBadge";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Pagination } from "@/components/Pagination";
import { ArticleGridSkeleton } from "@/components/LoadingSkeleton";
import { fetchArticles, fetchCategories, fetchTags } from "@/lib/api";
import type { SortOption } from "@/lib/types";
import { SortSelector } from "./SortSelector";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Jelajahi semua artikel knowledge base.",
};

export const revalidate = 60;

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const category = params.category || "";
  const tag = params.tag || "";
  const search = params.search || "";
  const sort = (params.sort || "latest") as SortOption;

  // Fetch articles + filter options in parallel
  const [articlesResult, categories, tags] = await Promise.all([
    fetchArticles({
      page,
      limit: 12,
      category: category || undefined,
      tag: tag || undefined,
      search: search || undefined,
      sort,
    }),
    fetchCategories(),
    fetchTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(articlesResult.meta.total_count / 12));
  const hasActiveFilter = category || tag || search;

  return (
    <div className="container-page py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-display text-[var(--text-primary)] mb-4">
          Artikel
        </h1>
        <p className="text-[var(--text-secondary)]">
          Jelajahi {articlesResult.meta.total_count} artikel di knowledge base.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4 mb-10">
        <div className="max-w-xl">
          <SearchBar defaultValue={search} placeholder="Cari artikel..." />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <SortSelector currentSort={sort} />

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Kategori:
              </span>
              {category && (
                <Link
                  href={`/articles${buildQueryString({ category: null, tag, search, sort })}`}
                  className="chip bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                >
                  ✕ Hapus filter
                </Link>
              )}
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/articles${buildQueryString({ category: cat.slug, tag, search, sort })}`}
                  className={`chip ${cat.slug === category ? "!bg-[var(--accent)] !text-white" : ""}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Tag:
              </span>
              {tag && (
                <Link
                  href={`/articles${buildQueryString({ category, tag: null, search, sort })}`}
                  className="chip bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                >
                  ✕ Hapus filter
                </Link>
              )}
              {tags.slice(0, 12).map((t) => (
                <TagBadge
                  key={t.id}
                  name={t.name}
                  slug={t.slug}
                  active={t.slug === tag}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Grid */}
      <Suspense fallback={<ArticleGridSkeleton count={12} />}>
        {articlesResult.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesResult.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/articles"
              searchParams={{
                ...(category && { category }),
                ...(tag && { tag }),
                ...(search && { search }),
                ...(sort !== "latest" && { sort }),
              }}
            />
          </>
        ) : (
          <EmptyState
            type="search"
            title={hasActiveFilter ? "Tidak ada hasil" : "Belum ada artikel"}
            description={
              hasActiveFilter
                ? "Coba ganti filter atau kata kunci pencarian."
                : "Belum ada artikel yang dipublikasikan. Mulai dari CMS Directus."
            }
            actionLabel={hasActiveFilter ? "Reset Filter" : "Kembali ke Beranda"}
            actionHref={hasActiveFilter ? "/articles" : "/"}
          />
        )}
      </Suspense>
    </div>
  );
}

// Helper: build query string, removing null values
function buildQueryString(updates: Record<string, string | null>) {
  // Start from current params concept — we're building relative links
  const parts: string[] = [];
  for (const [key, value] of Object.entries(updates)) {
    if (value) parts.push(`${key}=${encodeURIComponent(value)}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}
