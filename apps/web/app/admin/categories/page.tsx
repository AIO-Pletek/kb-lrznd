import Link from "next/link";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const list = await db.select().from(categories).orderBy(asc(categories.sort), asc(categories.name));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Kategori</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{list.length} kategori</p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus size={16} /> Kategori Baru
        </Link>
      </div>
      {list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-muted)]">Belum ada kategori.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Slug</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {list.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)] font-mono">/{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors inline-flex" title="Edit">
                      <Edit size={16} />
                    </Link>
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
