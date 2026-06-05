import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { EmptyState } from "@/components/EmptyState";
import { fetchCategories } from "@/lib/api";
import { Grid3X3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Jelajahi artikel berdasarkan kategori.",
};

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="container-page py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-display text-[var(--text-primary)] mb-4">
          Kategori
        </h1>
        <p className="text-[var(--text-secondary)]">
          Jelajahi {categories.length} kategori untuk menemukan artikel yang kamu butuhkan.
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada kategori"
          description="Kategori akan muncul setelah ditambahkan melalui CMS Directus."
          actionLabel="Kembali ke Beranda"
          actionHref="/"
        />
      )}
    </div>
  );
}
