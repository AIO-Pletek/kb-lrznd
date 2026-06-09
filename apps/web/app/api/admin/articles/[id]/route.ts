import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, articlesTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: {
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET /api/admin/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const [updated] = await db
      .update(articles)
      .set({
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(authorId !== undefined && { authorId: authorId || null }),
        ...(featuredImage !== undefined && { featuredImage: featuredImage || null }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(status !== undefined && {
          status,
          publishedAt: status === "published" && !publishedAt ? new Date() : publishedAt,
        }),
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    // Update tag relations
    if (tagIds !== undefined) {
      await db.delete(articlesTags).where(eq(articlesTags.articleId, id));
      if (tagIds.length > 0) {
        await db.insert(articlesTags).values(
          tagIds.map((tagId: string) => ({
            articleId: id,
            tagId,
          }))
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/admin/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete tag relations first
    await db.delete(articlesTags).where(eq(articlesTags.articleId, id));
    // Delete article
    const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/articles/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
