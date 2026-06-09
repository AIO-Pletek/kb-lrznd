"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAuthorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", role: "", avatar: "" });

  useEffect(() => {
    fetch(`/api/admin/authors`).then(r => r.json()).then((authors) => {
      const a = authors.find((x: any) => x.id === id);
      if (a) setForm({ name: a.name, role: a.role || "", avatar: a.avatar || "" });
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/authors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Gagal"); return; }
      router.push("/admin/authors"); router.refresh();
    } catch { setError("Terjadi kesalahan"); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus author ini?")) return;
    try {
      const res = await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Gagal menghapus"); return; }
      router.push("/admin/authors"); router.refresh();
    } catch { setError("Terjadi kesalahan"); }
  }

  if (fetching) return <div className="py-20 text-center text-[var(--text-muted)]">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">← Kembali</button>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Edit Author</h1>
        </div>
        <button onClick={handleDelete} className="btn-outline text-red-600 hover:bg-red-50">Hapus</button>
      </div>
      {error && <div className="mb-4 p-3 rounded-[var(--radius-sm)] bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Nama *</label>
          <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Role / Jabatan</label>
          <input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Avatar URL</label>
          <input type="text" value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} className="input" />
        </div>
        <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Menyimpan..." : "Simpan Perubahan"}</button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}
