import type { Metadata } from "next";
import {
  BookOpen,
  Search,
  PenTool,
  Users,
  Layout,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Cara menggunakan Kabe untuk dokumentasi tim — kabe.lrznd.my.id",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Dokumentasi Terpusat",
    description:
      "Semua panduan, SOP, dan referensi teknis dalam satu tempat yang mudah diakses.",
  },
  {
    icon: Search,
    title: "Pencarian Cepat",
    description:
      "Cari artikel berdasarkan judul, konten, kategori, atau tag dengan cepat.",
  },
  {
    icon: PenTool,
    title: "CMS Mudah",
    description:
      "Gunakan Directus CMS untuk menulis, mengedit, dan mengelola artikel tanpa coding.",
  },
  {
    icon: Users,
    title: "Kolaborasi Tim",
    description:
      "Tim bisa berkontribusi menulis artikel dan berbagi pengetahuan.",
  },
  {
    icon: Layout,
    title: "Kategori & Tag",
    description:
      "Organisir artikel berdasarkan kategori dan tag untuk navigasi yang rapi.",
  },
  {
    icon: Rocket,
    title: "Deployment Mudah",
    description:
      "Jalan dengan satu perintah Docker Compose. Siap production dalam hitungan menit.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-display text-[var(--text-primary)] mb-4">
          Tentang Kabe
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Platform knowledge base internal untuk dokumentasi, panduan, dan
          berbagi pengetahuan antar tim — kabe.lrznd.my.id. Dibangun dengan
          Next.js, Directus CMS, dan Docker.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="card p-6 group hover:border-[var(--accent)]/30"
            >
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--accent-subtle)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={20} className="text-[var(--accent)]" />
              </div>
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* How to use */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6 text-center">
          Cara Menggunakan
        </h2>

        <div className="space-y-8">
          <StepCard
            number={1}
            title="Akses CMS Directus"
            description={
              <>
                Buka <code className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono">/cms/admin</code> di browser.
                Login dengan akun admin yang sudah dikonfigurasi. Di sini kamu bisa
                membuat, mengedit, dan mengelola artikel, kategori, tag, dan author.
              </>
            }
          />
          <StepCard
            number={2}
            title="Buat Kategori & Author"
            description={
              <>
                Sebelum menulis artikel, buat dulu <strong>Categories</strong> untuk
                mengelompokkan konten, dan <strong>Authors</strong> untuk
                mengatribusikan penulis artikel.
              </>
            }
          />
          <StepCard
            number={3}
            title="Tulis Artikel"
            description={
              <>
                Buat artikel baru di koleksi <strong>Articles</strong>. Isi judul,
                slug, summary, pilih kategori, tag, author, dan tulis konten dalam
                format Markdown. Set status ke <strong>Published</strong> untuk
                menampilkan di frontend.
              </>
            }
          />
          <StepCard
            number={4}
            title="Akses dari Frontend"
            description={
              <>
                Artikel yang sudah published otomatis muncul di halaman utama,
                listing, kategori, dan hasil pencarian. Frontend di-render dengan
                SSR/ISR untuk performa optimal.
              </>
            }
          />
        </div>
      </div>

      {/* Tech stack */}
      <div className="max-w-2xl mx-auto mt-20 p-8 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4 text-center">
          Tech Stack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          <div className="p-3 rounded-[var(--radius)]">
            <span className="block font-semibold text-[var(--text-primary)]">Next.js</span>
            <span className="text-[var(--text-muted)] text-xs">Frontend</span>
          </div>
          <div className="p-3 rounded-[var(--radius)]">
            <span className="block font-semibold text-[var(--text-primary)]">Directus</span>
            <span className="text-[var(--text-muted)] text-xs">CMS</span>
          </div>
          <div className="p-3 rounded-[var(--radius)]">
            <span className="block font-semibold text-[var(--text-primary)]">PostgreSQL</span>
            <span className="text-[var(--text-muted)] text-xs">Database</span>
          </div>
          <div className="p-3 rounded-[var(--radius)]">
            <span className="block font-semibold text-[var(--text-primary)]">Docker</span>
            <span className="text-[var(--text-muted)] text-xs">Deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
