"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Generate page numbers with ellipsis
  const pages: (number | "...")[] = [];
  const delta = 1; // pages to show around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="btn-ghost p-2 rounded-[var(--radius)]"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className="p-2 text-[var(--text-muted)] opacity-40">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-muted)]"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            )}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="btn-ghost p-2 rounded-[var(--radius)]"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="p-2 text-[var(--text-muted)] opacity-40">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
