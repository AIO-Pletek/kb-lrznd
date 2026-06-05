import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ArticleGridSkeleton } from "@/components/LoadingSkeleton";
import { searchArticles } from "@/lib/api";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Cari",
  description: "Cari artikel di knowledge base.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <div className="container-page py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="font-display text-display text-[var(--text-primary)] mb-4">
          Cari Artikel
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Temukan panduan, dokumentasi, dan referensi yang kamu butuhkan.
        </p>
        <SearchBar defaultValue={q || ""} large />
      </div>

      {/* Results */}
      {q ? (
        <Suspense fallback={<ArticleGridSkeleton count={6} />}>
          <SearchResults query={q} />
        </Suspense>
      ) : (
        <EmptyState
          type="search"
          title="Ketikan kata kunci"
          description="Gunakan search bar di atas untuk mencari artikel."
          actionLabel="Jelajahi Artikel"
          actionHref="/articles"
        />
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const results = await searchArticles(query);

  if (results.length === 0) {
    return (
      <EmptyState
        type="search"
        title="Tidak ada hasil"
        description={`Tidak ada artikel yang cocok dengan "${query}". Coba kata kunci lain.`}
        actionLabel="Lihat Semua Artikel"
        actionHref="/articles"
      />
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Ditemukan {results.length} artikel untuk &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
