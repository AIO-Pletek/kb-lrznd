import Link from "next/link";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articleList = await db.query.articles.findMany({
    orderBy: [desc(articles.updatedAt)],
    with: {
      category: true,
      author: true,
    },
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      draft: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };
    return map[status] || map.draft;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Artikel
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {articleList.length} artikel
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          <Plus size={16} />
          Artikel Baru
        </Link>
      </div>

      {articleList.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-muted)]">
            Belum ada artikel. Buat artikel pertama kamu.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Judul
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Kategori
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {articleList.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {article.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        /{article.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {article.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(article.status)}`}
                    >
                      {article.status === "published"
                        ? "Published"
                        : article.status === "draft"
                          ? "Draft"
                          : "Archived"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
