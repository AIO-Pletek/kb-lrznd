"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAuthorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", role: "", avatar: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/authors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Gagal"); return; }
      router.push("/admin/authors"); router.refresh();
    } catch { setError("Terjadi kesalahan"); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">← Kembali</button>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Author Baru</h1>
      </div>
      {error && <div className="mb-4 p-3 rounded-[var(--radius-sm)] bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Nama *</label>
          <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Role / Jabatan</label>
          <input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="input" placeholder="Backend Engineer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Avatar URL</label>
          <input type="text" value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} className="input" placeholder="/uploads/avatar.jpg" />
        </div>
        <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Menyimpan..." : "Simpan"}</button>
          <button type="button" onClick={() => router.back()} className="btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}
