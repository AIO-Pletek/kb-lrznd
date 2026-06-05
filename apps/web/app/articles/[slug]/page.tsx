import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { TagBadge } from "@/components/TagBadge";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleDetailSkeleton } from "@/components/LoadingSkeleton";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/lib/api";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { Suspense } from "react";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: "Artikel tidak ditemukan" };

  return {
    title: article.title,
    description: article.summary || undefined,
    openGraph: {
      title: article.title,
      description: article.summary || undefined,
      type: "article",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
    },
  };
}

export const revalidate = 60;

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const readingTime = estimateReadingTime(article.content || article.summary);
  const hasToc = article.content ? article.content.match(/^(#{2,3})\s/gm) : null;

  return (
    <article className="pb-20">
      {/* Back link + meta bar */}
      <div className="container-content pt-8 pb-4">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Kembali ke artikel
        </Link>
      </div>

      {/* Header */}
      <header className="container-content mb-10">
        {/* Category + Status */}
        <div className="flex items-center gap-3 mb-4">
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="chip"
            >
              {article.category.name}
            </Link>
          )}
          {article.is_featured && (
            <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-display text-[var(--text-primary)] mb-4">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {article.summary}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] pb-6 border-b border-[var(--border-color)]">
          {article.author && (
            <div className="flex items-center gap-2">
              {article.author.avatar ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL || "/cms"}/assets/${article.author.avatar}`}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover bg-[var(--bg-tertiary)]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <span className="flex items-center gap-1">
                <User size={13} />
                <span className="font-medium text-[var(--text-primary)]">
                  {article.author.name}
                </span>
                {article.author.role && (
                  <span className="text-[var(--text-muted)]">
                    · {article.author.role}
                  </span>
                )}
              </span>
            </div>
          )}

          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {article.published_at ? formatDate(article.published_at) : "—"}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={13} />
            {readingTime} menit baca
          </span>

          {article.updated_at && article.updated_at !== article.published_at && (
            <span className="text-xs">
              Diperbarui {formatDate(article.updated_at)}
            </span>
          )}
        </div>

        {/* Tags + Copy link */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} slug={tag.slug} />
            ))}
          </div>
          <CopyLinkButton />
        </div>
      </header>

      {/* Content + TOC */}
      <div className="container-content">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
          {/* Main content */}
          <div className="min-w-0">
            {article.content ? (
              <MarkdownRenderer content={article.content} />
            ) : (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p>Konten artikel belum tersedia.</p>
              </div>
            )}
          </div>

          {/* Sidebar - TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {article.content && <TableOfContents content={article.content} />}
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {article.category && (
        <section className="container-content mt-16 pt-12 border-t border-[var(--border-color)]">
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">
            Artikel Terkait
          </h2>
          <Suspense fallback={null}>
            <RelatedArticles
              currentSlug={slug}
              categoryId={article.category.id}
            />
          </Suspense>
        </section>
      )}
    </article>
  );
}

async function RelatedArticles({
  currentSlug,
  categoryId,
}: {
  currentSlug: string;
  categoryId: string;
}) {
  const articles = await fetchRelatedArticles(currentSlug, categoryId, 3);
  if (articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="compact" />
      ))}
    </div>
  );
}
