"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  large?: boolean;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = "Cari artikel, panduan, dokumentasi...",
  large = false,
  defaultValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = value.trim();
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    },
    [value, router]
  );

  const clearInput = useCallback(() => {
    setValue("");
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search
          size={large ? 20 : 18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`input pl-11 ${large ? "pr-12 py-3.5 text-base" : "pr-10"}`}
        />
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={large ? 18 : 16} />
          </button>
        )}
      </div>
    </form>
  );
}
