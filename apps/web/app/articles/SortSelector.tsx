"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Terbaru" },
  { value: "updated", label: "Terakhir Diupdate" },
  { value: "title", label: "Alfabetis" },
];

interface SortSelectorProps {
  currentSort: SortOption;
}

export function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const newSort = e.target.value;
      if (newSort === "latest") {
        params.delete("sort");
      } else {
        params.set("sort", newSort);
      }
      params.delete("page"); // Reset page on sort change
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-[var(--text-muted)]" />
      <select
        value={currentSort}
        onChange={handleSort}
        className="text-sm bg-transparent border border-[var(--border-color)] rounded-[var(--radius)] px-3 py-1.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
