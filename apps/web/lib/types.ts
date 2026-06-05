// ============================================
// Kabe — TypeScript Types
// ============================================

export interface Author {
  id: string;
  name: string;
  role: string | null;
  avatar: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort: number | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  status: "draft" | "published" | "archived";
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  category: Category | null;
  tags: Tag[] | null;
  author: Author | null;
  featured_image: string | null;
  is_featured: boolean;
  published_at: string | null;
  updated_at: string | null;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  tags: Pick<Tag, "id" | "name" | "slug">[] | null;
  author: Pick<Author, "id" | "name" | "avatar"> | null;
  featured_image: string | null;
  is_featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  reading_time?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total_count: number;
    page: number;
    page_size: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
  published_at: string | null;
}

export type SortOption = "latest" | "updated" | "title";
