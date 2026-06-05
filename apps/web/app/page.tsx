import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { EmptyState } from "@/components/EmptyState";
import { ArticleGridSkeleton } from "@/components/LoadingSkeleton";
import { fetchArticles, fetchCategories } from "@/lib/api";
import { Suspense } from "react";

export const revalidate = 60; // ISR: revalidate setiap 60 detik

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-subtle)]/60 to-transparent pointer-events-none" />

        <div className="container-page section relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-sm font-medium mb-8 animate-fade-in">
              <Sparkles size={14} />
              Knowledge Base Internal
            </div>

            {/* Heading */}
            <h1 className="font-display text-display-lg text-[var(--text-primary)] mb-6 animate-slide-up">
              Temukan jawaban
              <br />
              <span className="text-gradient">dalam hitungan detik</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-slide-up">
              Pusat dokumentasi dan pengetahuan internal tim. Cari panduan,
              artikel, dan referensi teknis dengan cepat.
            </p>

            {/* Search */}
            <div className="animate-slide-up">
              <SearchBar large />
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-10 text-sm text-[var(--text-muted)] animate-fade-in">
              <Suspense fallback={null}>
                <StatsSummary />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ARTICLES ============ */}
      <section className="section-sm">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={20} className="text-[var(--accent)]" />
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                Artikel Pilihan
              </h2>
            </div>
            <Link
              href="/articles"
              className="btn-ghost text-sm gap-1.5"
            >
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>

          <Suspense fallback={<ArticleGridSkeleton count={3} />}>
            <FeaturedArticles />
          </Suspense>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="section-sm bg-[var(--bg-secondary)]">
        <div className="container-page">
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
            Jelajahi Kategori
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Temukan artikel berdasarkan topik yang kamu butuhkan.
          </p>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse space-y-3">
                    <div className="skeleton h-10 w-10" />
                    <div className="skeleton h-5 w-24" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                ))}
              </div>
            }
          >
            <CategoriesSection />
          </Suspense>
        </div>
      </section>

      {/* ============ RECENTLY UPDATED ============ */}
      <section className="section-sm">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <Clock size={20} className="text-[var(--accent)]" />
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                Terbaru Diperbarui
              </h2>
            </div>
            <Link
              href="/articles?sort=updated"
              className="btn-ghost text-sm gap-1.5"
            >
              Lihat semua <ArrowRight size={14} />
            </Link>
          </div>

          <Suspense fallback={<ArticleGridSkeleton count={6} />}>
            <RecentArticles />
          </Suspense>
        </div>
      </section>
    </>
  );
}

// ============================================
// Async sub-components (server components)
// ============================================

async function StatsSummary() {
  try {
    const [articlesResult, categories] = await Promise.all([
      fetchArticles({ limit: 1 }),
      fetchCategories(),
    ]);
    const totalArticles = articlesResult.meta.total_count;
    return (
      <>
        <span>{totalArticles}+ artikel</span>
        <span className="text-[var(--border-color)]">•</span>
        <span>{categories.length} kategori</span>
      </>
    );
  } catch {
    return null;
  }
}

async function FeaturedArticles() {
  try {
    const result = await fetchArticles({ featured: true, limit: 3 });
    if (result.data.length === 0) {
      // Fallback: ambil artikel terbaru sebagai featured
      const fallback = await fetchArticles({ limit: 3, sort: "latest" });
      if (fallback.data.length === 0) {
        return <EmptyState type="general" />;
      }
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {fallback.data.map((article, i) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={i === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {result.data.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant={i === 0 ? "featured" : "default"}
          />
        ))}
      </div>
    );
  } catch {
    return <EmptyState type="general" />;
  }
}

async function CategoriesSection() {
  try {
    const categories = await fetchCategories();
    if (categories.length === 0) {
      return <EmptyState type="general" title="Belum ada kategori" description="Kategori akan muncul setelah ditambahkan dari CMS." />;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.slice(0, 8).map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    );
  } catch {
    return <EmptyState type="general" />;
  }
}

async function RecentArticles() {
  try {
    const result = await fetchArticles({ limit: 6, sort: "updated" });
    if (result.data.length === 0) {
      return <EmptyState type="general" />;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.data.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  } catch {
    return <EmptyState type="general" />;
  }
}
