import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

// ============================================
// Reading time
// ============================================

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

// ============================================
// Date formatting
// ============================================

export function formatDate(
  dateStr: string | null | undefined,
  pattern = "d MMMM yyyy"
): string {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), pattern, { locale: id });
  } catch {
    return "—";
  }
}

export function formatRelativeDate(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return "—";
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return "—";
  }
}

// ============================================
// Directus asset URL
// ============================================

export function getAssetUrl(
  imageId: string | null | undefined,
  directusUrl?: string
): string | null {
  if (!imageId) return null;
  const base = directusUrl || process.env.NEXT_PUBLIC_DIRECTUS_URL || "/cms";
  return `${base}/assets/${imageId}`;
}

// ============================================
// Classname merge (simple cn)
// ============================================

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================
// Slug helpers
// ============================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

// ============================================
// Truncate text
// ============================================

export function truncate(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
