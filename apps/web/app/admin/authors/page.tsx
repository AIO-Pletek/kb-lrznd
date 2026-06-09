import Link from "next/link";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Plus, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  const list = await db.select().from(authors).orderBy(asc(authors.name));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Author</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{list.length} author</p>
        </div>
        <Link href="/admin/authors/new" className="btn-primary"><Plus size={16} /> Author Baru</Link>
      </div>
      {list.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-[var(--text-muted)]">Belum ada author.</p></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Role</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {list.map((author) => (
                <tr key={author.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {author.avatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover" />}
                      <span className="text-sm font-medium text-[var(--text-primary)]">{author.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{author.role || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/authors/${author.id}/edit`} className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors inline-flex" title="Edit"><Edit size={16} /></Link>
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
