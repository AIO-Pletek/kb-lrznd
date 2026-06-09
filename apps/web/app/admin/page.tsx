import { db } from "@/lib/db";
import { articles, categories, authors } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { FileText, FolderOpen, Tags, Users, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [articleCount] = await db
    .select({ count: count() })
    .from(articles);

  const [publishedCount] = await db
    .select({ count: count() })
    .from(articles)
    .where(eq(articles.status, "published"));

  const recentArticles = await db.query.articles.findMany({
    orderBy: [desc(articles.updatedAt)],
    limit: 5,
    with: { category: true, author: true },
  });

  const stats = [
    {
      label: "Total Artikel",
      value: articleCount?.count ?? 0,
      href: "/admin/articles",
      icon: FileText,
      color: "brand",
    },
    {
      label: "Published",
      value: publishedCount?.count ?? 0,
      href: "/admin/articles",
      icon: FileText,
      color: "green",
    },
    {
      label: "Kategori",
      value: "-",
      href: "/admin/categories",
      icon: FolderOpen,
      color: "amber",
    },
    {
      label: "Author",
      value: "-",
      href: "/admin/authors",
      icon: Users,
      color: "purple",
    },
  ];

  const colorMap: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Selamat datang di Kabe CMS
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          <Plus size={16} />
          Artikel Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-[var(--radius)] ${colorMap[stat.color]}`}
              >
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">
            Artikel Terbaru
          </h2>
          <Link
            href="/admin/articles"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] py-8 text-center">
            Belum ada artikel.{" "}
            <Link href="/admin/articles/new" className="text-[var(--accent)]">
              Buat artikel pertama
            </Link>
          </p>
        ) : (
          <div className="space-y-0.5">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}/edit`}
                className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {article.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {article.category?.name ?? "Tanpa kategori"}
                  </p>
                </div>
                <span
                  className={`shrink-0 ml-3 text-xs px-2 py-0.5 rounded-full ${
                    article.status === "published"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : article.status === "draft"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {article.status === "published"
                    ? "Published"
                    : article.status === "draft"
                      ? "Draft"
                      : "Archived"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
