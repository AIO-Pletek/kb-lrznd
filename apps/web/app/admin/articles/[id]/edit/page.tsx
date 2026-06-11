"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { slugify } from "@/lib/utils";
import { FileUpload, FilePreview } from "@/components/admin/FileUpload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
}

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  category: Category | null;
  author: Author | null;
  tags: { tag: Tag }[] | null;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  featuredImage: string | null;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    categoryId: "",
    authorId: "",
    selectedTags: [] as string[],
    isFeatured: false,
    status: "draft" as "draft" | "published" | "archived",
    featuredImage: "" as string,
    featuredImageMeta: null as { name: string; url: string; type: string; size: number; category: string } | null,
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/admin/tags").then((r) => r.json()).then(setTags);
    fetch("/api/admin/authors").then((r) => r.json()).then(setAuthors);
  }, []);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/admin/articles/${id}`);
        if (!res.ok) {
          setError("Artikel tidak ditemukan");
          return;
        }
        const article: ArticleData = await res.json();
        setForm({
          title: article.title,
          slug: article.slug,
          summary: article.summary || "",
          content: article.content || "",
          categoryId: article.category?.id || "",
          authorId: article.author?.id || "",
          selectedTags: article.tags?.map((t) => t.tag.id) || [],
          isFeatured: article.isFeatured,
          status: article.status,
          featuredImage: article.featuredImage || "",
        });
      } catch {
        setError("Gagal memuat artikel");
      } finally {
        setFetching(false);
      }
    }
    loadArticle();
  }, [id]);

  function toggleTag(tagId: string) {
    setForm((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((tid) => tid !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          summary: form.summary,
          content: form.content,
          categoryId: form.categoryId || null,
          authorId: form.authorId || null,
          tagIds: form.selectedTags,
          isFeatured: form.isFeatured,
          status: form.status,
          featuredImage: form.featuredImage || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Gagal menghapus artikel");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--text-muted)]">Memuat...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ← Kembali
          </button>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
            Edit Artikel
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="btn-outline text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          Hapus
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-[var(--radius-sm)] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Judul *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="input text-lg font-semibold"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Slug *
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="input font-mono text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  status: e.target.value as "draft" | "published" | "archived",
                }))
              }
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Ringkasan
          </label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
            className="input min-h-[80px]"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Konten (Markdown)
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            className="input font-mono text-sm min-h-[300px]"
            rows={20}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Kategori
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              className="input"
            >
              <option value="">— Tanpa Kategori —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Author
            </label>
            <select
              value={form.authorId}
              onChange={(e) => setForm((p) => ({ ...p, authorId: e.target.value }))}
              className="input"
            >
              <option value="">— Tanpa Author —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  form.selectedTags.includes(tag.id)
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Featured Image
          </label>
          {form.featuredImage ? (
            <FilePreview
              files={form.featuredImageMeta ? [form.featuredImageMeta] : [{ name: "Featured", url: form.featuredImage, type: "image/*", size: 0, category: "images" }]}
              onRemove={() => setForm((p) => ({ ...p, featuredImage: "", featuredImageMeta: null }))}
              compact
            />
          ) : (
            <FileUpload
              onUpload={(files) => {
                if (files[0]) {
                  setForm((p) => ({ ...p, featuredImage: files[0].url, featuredImageMeta: files[0] }));
                }
              }}
              accept="image/*"
              multiple={false}
              label="Upload Featured Image"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={form.isFeatured}
            onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
            className="rounded"
          />
          <label htmlFor="isFeatured" className="text-sm text-[var(--text-secondary)]">
            Featured article
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
