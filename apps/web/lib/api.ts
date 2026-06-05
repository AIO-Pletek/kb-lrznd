import { directus, readItems, readItem } from "@/lib/directus";
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
// Article queries
// ============================================

const ARTICLE_LIST_FIELDS = [
  "id",
  "title",
  "slug",
  "summary",
  "is_featured",
  "published_at",
  "updated_at",
  "featured_image",
  "category.id",
  "category.name",
  "category.slug",
  "tags.id",
  "tags.name",
  "tags.slug",
  "author.id",
  "author.name",
  "author.avatar",
];

const ARTICLE_DETAIL_FIELDS = [
  "*",
  "category.*",
  "tags.*",
  "author.*",
];

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

  const filter: Record<string, unknown> = {
    status: { _eq: "published" },
  };

  if (category) {
    filter["category"] = { slug: { _eq: category } };
  }

  if (tag) {
    filter["tags"] = { slug: { _eq: tag } };
  }

  if (search) {
    filter["_or"] = [
      { title: { _icontains: search } },
      { summary: { _icontains: search } },
      { content: { _icontains: search } },
    ];
  }

  if (featured !== undefined) {
    filter["is_featured"] = { _eq: featured };
  }

  const sortMap: Record<SortOption, string> = {
    latest: "-published_at",
    updated: "-updated_at",
    title: "title",
  };

  // Directus SDK v17+ readItems returns array directly, we need explicit typing
  const rawData = await directus.request(
    readItems("articles", {
      fields: ARTICLE_LIST_FIELDS,
      filter,
      sort: [sortMap[sort]],
      page,
      limit,
      // deep field filter not needed for v17
    })
  );

  // Cast to unknown first, then to the expected type
  const articles = (rawData as unknown) as ArticleListItem[];

  // Attach reading time
  const data = articles.map((a) => ({
    ...a,
    reading_time: estimateReadingTime(a.summary),
  }));

  // Note: Directus SDK v17 returns raw data array without total count.
  // We estimate: if page is full, assume there are more items.
  const hasMore = data.length === limit;
  const estimatedTotal = hasMore
    ? page * limit + 1 // Ada halaman berikutnya
    : (page - 1) * limit + data.length; // Halaman terakhir

  return {
    data,
    meta: {
      total_count: estimatedTotal,
      page,
      page_size: limit,
    },
  };
}

export async function fetchArticleBySlug(
  slug: string
): Promise<Article | null> {
  try {
    const filter = {
      slug: { _eq: slug },
      status: { _eq: "published" },
    };

    const rawResults = await directus.request(
      readItems("articles", {
        fields: ARTICLE_DETAIL_FIELDS,
        filter,
        limit: 1,
      })
    );

    const results = rawResults as unknown as Article[];
    return results[0] || null;
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
    const filter = {
      status: { _eq: "published" },
      slug: { _neq: currentSlug },
      category: { id: { _eq: categoryId } },
    };

    const rawData = await directus.request(
      readItems("articles", {
        fields: ARTICLE_LIST_FIELDS,
        filter,
        sort: ["-published_at"],
        limit,
      })
    );

    return rawData as unknown as ArticleListItem[];
  } catch {
    return [];
  }
}

// ============================================
// Category queries
// ============================================

export async function fetchCategories(): Promise<Category[]> {
  try {
    const rawData = await directus.request(
      readItems("categories", {
        fields: ["*"],
        sort: ["sort", "name"],
      })
    );
    return rawData as unknown as Category[];
  } catch {
    return [];
  }
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const filter = { slug: { _eq: slug } };
    const rawData = await directus.request(
      readItems("categories", {
        fields: ["*"],
        filter,
        limit: 1,
      })
    );
    const results = rawData as unknown as Category[];
    return results[0] || null;
  } catch {
    return null;
  }
}

// ============================================
// Tag queries
// ============================================

export async function fetchTags(): Promise<Tag[]> {
  try {
    const rawData = await directus.request(
      readItems("tags", {
        fields: ["*"],
        sort: ["name"],
      })
    );
    return rawData as unknown as Tag[];
  } catch {
    return [];
  }
}

// ============================================
// Author queries
// ============================================

export async function fetchAuthors(): Promise<Author[]> {
  try {
    const rawData = await directus.request(
      readItems("authors", {
        fields: ["*"],
        sort: ["name"],
      })
    );
    return rawData as unknown as Author[];
  } catch {
    return [];
  }
}

// ============================================
// Search query (dedicated)
// ============================================

export async function searchArticles(
  query: string,
  limit = 20
): Promise<ArticleListItem[]> {
  if (!query.trim()) return [];

  try {
    const filter = {
      status: { _eq: "published" },
      _or: [
        { title: { _icontains: query } },
        { summary: { _icontains: query } },
        { content: { _icontains: query } },
      ],
    };

    const rawData = await directus.request(
      readItems("articles", {
        fields: ARTICLE_LIST_FIELDS,
        filter,
        sort: ["-published_at"],
        limit,
      })
    );

    return rawData as unknown as ArticleListItem[];
  } catch {
    return [];
  }
}

// ============================================
// Static params for SSG/ISR
// ============================================

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const rawData = await directus.request(
      readItems("articles", {
        fields: ["slug"],
        filter: { status: { _eq: "published" } },
        limit: 500,
      })
    );
    const data = rawData as unknown as { slug: string }[];
    return data.map((a) => a.slug);
  } catch {
    return [];
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const rawData = await directus.request(
      readItems("categories", {
        fields: ["slug"],
        limit: 100,
      })
    );
    const data = rawData as unknown as { slug: string }[];
    return data.map((c) => c.slug);
  } catch {
    return [];
  }
}
