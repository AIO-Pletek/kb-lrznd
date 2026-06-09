import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, articlesTags } from "@/lib/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const result = await db.query.articles.findMany({
      orderBy: [desc(articles.updatedAt)],
      limit,
      offset,
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/articles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      summary,
      content,
      categoryId,
      authorId,
      tagIds,
      featuredImage,
      isFeatured,
      status,
      publishedAt,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title dan slug wajib diisi" }, { status: 400 });
    }

    const [article] = await db
      .insert(articles)
      .values({
        title,
        slug,
        summary: summary || null,
        content: content || null,
        categoryId: categoryId || null,
        authorId: authorId || null,
        featuredImage: featuredImage || null,
        isFeatured: isFeatured || false,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : (publishedAt || null),
      })
      .returning();

    // Insert tag relations
    if (tagIds && tagIds.length > 0) {
      await db.insert(articlesTags).values(
        tagIds.map((tagId: string) => ({
          articleId: article.id,
          tagId,
        }))
      );
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/articles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
