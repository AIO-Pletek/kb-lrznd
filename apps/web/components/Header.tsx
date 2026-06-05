"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/articles", label: "Artikel" },
  { href: "/categories", label: "Kategori" },
  { href: "/about", label: "Tentang" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-bold text-lg text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-[var(--radius)] bg-[var(--accent)] text-white">
            <BookOpen size={18} />
          </span>
          <span className="hidden sm:inline">Kabe</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-[var(--radius)] text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search icon (mobile trigger) */}
          <Link
            href="/search"
            className="btn-ghost p-2 rounded-full"
            aria-label="Cari artikel"
          >
            <Search size={18} />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="btn-ghost p-2 rounded-full"
            aria-label="Ganti tema"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-ghost p-2 rounded-full md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)] animate-slide-up">
          <div className="container-page py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
