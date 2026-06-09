import { db } from "@/lib/db";
import { articles, categories, tags, authors } from "@/lib/db/schema";
import { eq, ne, and, or, ilike, desc, asc, SQL } from "drizzle-orm";
import type {
  Article,
  ArticleListItem,
  Category,
  Tag,
  Author,
  PaginatedResponse,
  SortOption,
} from "@/lib/types";
import { estimateReadingTime } from "@/lib/utils";

// ============================================
// Helpers: map Drizzle results → existing Directus-shaped types
// ============================================

function mapArticleListItem(row: any): ArticleListItem {
  const tagList: Pick<Tag, "id" | "name" | "slug">[] =
    row.tags?.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
      slug: t.tag.slug,
    })) ?? [];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    featured_image: row.featuredImage,
    is_featured: row.isFeatured,
    published_at: row.publishedAt?.toISOString?.() ?? row.publishedAt ?? null,
    updated_at: row.updatedAt?.toISOString?.() ?? row.updatedAt ?? null,
    category: row.category
      ? { id: row.category.id, name: row.category.name, slug: row.category.slug }
      : null,
    tags: tagList,
    author: row.author
      ? { id: row.author.id, name: row.author.name, avatar: row.author.avatar }
      : null,
    reading_time: estimateReadingTime(row.summary),
  };
}

function mapArticleDetail(row: any): Article {
  const tagList: Tag[] =
    row.tags?.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
      slug: t.tag.slug,
    })) ?? [];

  return {
    id: row.id,
    status: row.status,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    featured_image: row.featuredImage,
    is_featured: row.isFeatured,
    published_at: row.publishedAt?.toISOString?.() ?? row.publishedAt ?? null,
    updated_at: row.updatedAt?.toISOString?.() ?? row.updatedAt ?? null,
    category: row.category
      ? {
          id: row.category.id,
          name: row.category.name,
          slug: row.category.slug,
          description: row.category.description,
          icon: row.category.icon,
          sort: row.category.sort,
        }
      : null,
    tags: tagList,
    author: row.author
      ? {
          id: row.author.id,
          name: row.author.name,
          role: row.author.role,
          avatar: row.author.avatar,
        }
      : null,
  };
}

// ============================================
// Article queries
// ============================================

interface FetchArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: SortOption;
  featured?: boolean;
}

export async function fetchArticles(
  params: FetchArticlesParams = {}
): Promise<PaginatedResponse<ArticleListItem>> {
  const { page = 1, limit = 12, category, tag, search, sort = "latest", featured } = params;

  try {
    const conditions: SQL[] = [eq(articles.status, "published")];

    if (featured !== undefined) {
      conditions.push(eq(articles.isFeatured, featured));
    }

    if (search) {
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.summary, `%${search}%`),
          ilike(articles.content, `%${search}%`)
        )!
      );
    }

    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const sortMap: Record<SortOption, ReturnType<typeof desc<any>>> = {
      latest: desc(articles.publishedAt),
      updated: desc(articles.updatedAt),
      title: asc(articles.title),
    };

    const offset = (page - 1) * limit;

    // We need nested filtering for category & tag — handled via sub-queries
    let query = db.query.articles.findMany({
      where,
      orderBy: [sortMap[sort]],
      limit,
      offset,
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    let rows = await query;

    // Post-filter for category and tag (since Drizzle relational query
    // can't directly filter on relation fields in all cases)
    if (category) {
      rows = rows.filter((r: any) => r.category?.slug === category);
    }

    if (tag) {
      rows = rows.filter((r: any) => r.tags?.some((t: any) => t.tag.slug === tag));
    }

    const data = rows.map(mapArticleListItem);

    const hasMore = data.length === limit;
    const estimatedTotal = hasMore
      ? page * limit + 1
      : (page - 1) * limit + data.length;

    return {
      data,
      meta: {
        total_count: estimatedTotal,
        page,
        page_size: limit,
      },
    };
  } catch (error) {
    console.error("fetchArticles error:", error);
    return {
      data: [],
      meta: { total_count: 0, page, page_size: limit },
    };
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const rows = await db.query.articles.findMany({
      where: and(eq(articles.slug, slug), eq(articles.status, "published")),
      limit: 1,
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    if (rows.length === 0) return null;
    return mapArticleDetail(rows[0]);
  } catch {
    return null;
  }
}

export async function fetchRelatedArticles(
  currentSlug: string,
  categoryId: string,
  limit = 3
): Promise<ArticleListItem[]> {
  try {
    const rows = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        ne(articles.slug, currentSlug),
        eq(articles.categoryId, categoryId)
      ),
      orderBy: [desc(articles.publishedAt)],
      limit,
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    return rows.map(mapArticleListItem);
  } catch {
    return [];
  }
}

// ============================================
// Category queries
// ============================================

export async function fetchCategories(): Promise<Category[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sort), asc(categories.name));
    return rows.map((c) => ({
      ...c,
      created_at: c.createdAt?.toISOString?.() ?? c.createdAt,
      updated_at: c.updatedAt?.toISOString?.() ?? c.updatedAt,
    })) as unknown as Category[];
  } catch {
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    return {
      ...rows[0],
      created_at: rows[0].createdAt?.toISOString?.() ?? rows[0].createdAt,
      updated_at: rows[0].updatedAt?.toISOString?.() ?? rows[0].updatedAt,
    } as unknown as Category;
  } catch {
    return null;
  }
}

// ============================================
// Tag queries
// ============================================

export async function fetchTags(): Promise<Tag[]> {
  try {
    const rows = await db.select().from(tags).orderBy(asc(tags.name));
    return rows.map((t) => ({
      ...t,
      created_at: t.createdAt?.toISOString?.() ?? t.createdAt,
    })) as unknown as Tag[];
  } catch {
    return [];
  }
}

// ============================================
// Author queries
// ============================================

export async function fetchAuthors(): Promise<Author[]> {
  try {
    const rows = await db.select().from(authors).orderBy(asc(authors.name));
    return rows.map((a) => ({
      ...a,
      created_at: a.createdAt?.toISOString?.() ?? a.createdAt,
    })) as unknown as Author[];
  } catch {
    return [];
  }
}

// ============================================
// Search query
// ============================================

export async function searchArticles(
  query: string,
  limit = 20
): Promise<ArticleListItem[]> {
  if (!query.trim()) return [];

  try {
    const rows = await db.query.articles.findMany({
      where: and(
        eq(articles.status, "published"),
        or(
          ilike(articles.title, `%${query}%`),
          ilike(articles.summary, `%${query}%`),
          ilike(articles.content, `%${query}%`)
        )
      ),
      orderBy: [desc(articles.publishedAt)],
      limit,
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    return rows.map(mapArticleListItem);
  } catch {
    return [];
  }
}

// ============================================
// Static params for SSG/ISR
// ============================================

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: articles.slug })
      .from(articles)
      .where(eq(articles.status, "published"))
      .limit(500);
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: categories.slug })
      .from(categories)
      .limit(100);
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
