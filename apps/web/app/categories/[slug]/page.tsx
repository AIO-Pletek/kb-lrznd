import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ArticleGridSkeleton } from "@/components/LoadingSkeleton";
import { fetchCategoryBySlug, fetchArticles } from "@/lib/api";
import { Suspense } from "react";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: "Kategori tidak ditemukan" };

  return {
    title: category.name,
    description: category.description || `Artikel dalam kategori ${category.name}`,
  };
}

export const revalidate = 60;

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);

  const [category, articlesResult] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchArticles({ category: slug, page, limit: 12 }),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(articlesResult.meta.total_count / 12));

  return (
    <div className="container-page py-12">
      {/* Back link */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Semua kategori
      </Link>

      {/* Category Header */}
      <div className="mb-10">
        {category.icon && (
          <span className="text-4xl mb-4 block" role="img" aria-hidden="true">
            {category.icon}
          </span>
        )}
        <h1 className="font-display text-display text-[var(--text-primary)] mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Articles */}
      <Suspense fallback={<ArticleGridSkeleton count={6} />}>
        <CategoryArticles slug={slug} page={page} />
      </Suspense>
    </div>
  );
}

async function CategoryArticles({
  slug,
  page,
}: {
  slug: string;
  page: number;
}) {
  const result = await fetchArticles({ category: slug, page, limit: 12 });

  if (result.data.length === 0) {
    return (
      <EmptyState
        title="Belum ada artikel"
        description="Belum ada artikel dalam kategori ini. Mulai menulis dari CMS Directus."
        actionLabel="Kembali ke Kategori"
        actionHref="/categories"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {result.data.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
