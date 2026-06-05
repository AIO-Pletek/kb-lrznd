import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  slug: string;
  active?: boolean;
}

export function TagBadge({ name, slug, active }: TagBadgeProps) {
  const Component = active ? "span" : Link;
  const props = active ? {} : { href: `/articles?tag=${slug}` };

  return (
    <Component
      {...(props as Record<string, string>)}
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
        active
          ? "bg-[var(--accent)] text-white"
          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
      )}
    >
      {name}
    </Component>
  );
}
