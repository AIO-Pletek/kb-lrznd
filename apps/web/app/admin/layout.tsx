import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Users,
  LogOut,
  Image,
} from "lucide-react";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const pathname = (await headers()).get("x-pathname") || "";

  // Jangan redirect kalo lagi di halaman login (hindari infinite loop)
  if (!session.isLoggedIn && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Artikel", icon: FileText },
    { href: "/admin/categories", label: "Kategori", icon: FolderOpen },
    { href: "/admin/tags", label: "Tag", icon: Tags },
    { href: "/admin/authors", label: "Author", icon: Users },
    { href: "/admin/files", label: "File Manager", icon: Image },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <aside className="w-60 bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-[var(--border-color)]">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 text-[var(--text-primary)] font-display font-bold text-lg"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm">
              K
            </span>
            Kabe
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-1"
          >
            Lihat Website ↗
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-[var(--radius-sm)] text-xs text-[var(--text-muted)] hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
