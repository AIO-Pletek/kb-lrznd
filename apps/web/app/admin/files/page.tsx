"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Trash2, Copy, Search, Grid3X3, List,
  ImageIcon, FileText, Film, File, FolderOpen, Download,
} from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  category: string;
  modified: string;
}

const CATEGORIES = [
  { key: "", label: "Semua", icon: FolderOpen },
  { key: "images", label: "Gambar", icon: ImageIcon },
  { key: "documents", label: "Dokumen", icon: FileText },
  { key: "videos", label: "Video", icon: Film },
  { key: "others", label: "Lainnya", icon: File },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getIcon(category: string) {
  switch (category) {
    case "images": return ImageIcon;
    case "documents": return FileText;
    case "videos": return Film;
    default: return File;
  }
}

function getColor(category: string) {
  switch (category) {
    case "images": return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "documents": return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "videos": return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

export default function FileManagerPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState("");

  const loadFiles = useCallback(async (cat?: string) => {
    setLoading(true);
    try {
      const url = cat ? `/api/admin/upload?category=${cat}` : "/api/admin/upload";
      const res = await fetch(url);
      const data = await res.json();
      setFiles(data.files || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(category); }, [category, loadFiles]);

  async function handleDelete(filename: string, category: string) {
    if (!confirm(`Hapus file "${filename}"?`)) return;
    try {
      const res = await fetch(`/api/admin/upload/${filename}`, { method: "DELETE" });
      if (res.ok) loadFiles(category || undefined);
    } catch { /* ignore */ }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Hapus ${selected.size} file?`)) return;
    for (const key of selected) {
      const [cat, name] = key.split("::");
      try { await fetch(`/api/admin/upload/${name}`, { method: "DELETE" }); } catch {}
    }
    setSelected(new Set());
    loadFiles(category || undefined);
  }

  function copyUrl(url: string) {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  function toggleSelect(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.url.toLowerCase().includes(query.toLowerCase())
  );

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const imageCount = files.filter((f) => f.category === "images").length;
  const docCount = files.filter((f) => f.category === "documents").length;
  const videoCount = files.filter((f) => f.category === "videos").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            File Manager
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {files.length} file · {formatSize(totalSize)} · {imageCount} gambar · {docCount} dokumen · {videoCount} video
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="btn-outline text-red-600 hover:bg-red-50 text-sm">
              <Trash2 size={14} /> Hapus ({selected.size})
            </button>
          )}
          <div className="flex rounded-[var(--radius)] border border-[var(--border-color)] overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-[var(--accent-subtle)] text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
            ><Grid3X3 size={16} /></button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-[var(--accent-subtle)] text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
            ><List size={16} /></button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              category === key
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari file..."
          className="input pl-9 text-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-[var(--text-muted)]">Memuat...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)]">Belum ada file. Upload dari halaman Artikel.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredFiles.map((file) => {
            const key = `${file.category}::${file.name}`;
            const isImg = file.category === "images";
            const Icon = getIcon(file.category);
            return (
              <div
                key={key}
                className={`relative group rounded-[var(--radius)] border transition-all ${
                  selected.has(key)
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                    : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
                }`}
                onClick={() => toggleSelect(key)}
              >
                {isImg ? (
                  <div className="aspect-square bg-[var(--bg-tertiary)] rounded-t-[var(--radius)] overflow-hidden">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-square bg-[var(--bg-tertiary)] rounded-t-[var(--radius)] flex items-center justify-center">
                    <Icon size={32} className="text-[var(--text-muted)]" />
                  </div>
                )}

                <div className="p-2 border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-primary)] truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {formatSize(file.size)}
                  </p>
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-[var(--radius)] transition-colors">
                  <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                      className="p-1.5 rounded bg-white/90 dark:bg-black/70 shadow-sm hover:bg-white"
                      title="Copy URL"
                    >
                      {copied === file.url ? (
                        <span className="text-[10px] text-green-600 font-medium">✓</span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded bg-white/90 dark:bg-black/70 shadow-sm hover:bg-white"
                      title="Download"
                    >
                      <Download size={12} />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(file.name, file.category); }}
                      className="p-1.5 rounded bg-white/90 dark:bg-black/70 shadow-sm hover:bg-white text-red-600"
                      title="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] uppercase">File</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] uppercase">Tipe</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] uppercase">Ukuran</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredFiles.map((file) => {
                const Icon = getIcon(file.category);
                return (
                  <tr key={`${file.category}::${file.name}`} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} className="text-[var(--text-muted)] shrink-0" />
                        <span className="text-sm text-[var(--text-primary)] truncate max-w-[300px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getColor(file.category)}`}>
                        {file.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{formatSize(file.size)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => copyUrl(file.url)} className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]" title="Copy URL">
                          {copied === file.url ? <span className="text-[10px] text-green-600">✓</span> : <Copy size={14} />}
                        </button>
                        <a href={file.url} target="_blank" className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]" title="Download">
                          <Download size={14} />
                        </a>
                        <button onClick={() => handleDelete(file.name, file.category)} className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-red-500" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
