import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============================================
// Enums
// ============================================
export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "published",
  "archived",
]);

// ============================================
// Categories
// ============================================
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  sort: integer("sort").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Tags
// ============================================
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Authors
// ============================================
export const authors = pgTable("authors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Articles
// ============================================
export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: articleStatusEnum("status").default("draft").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  summary: text("summary"),
  content: text("content"),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  authorId: uuid("author_id").references(() => authors.id, {
    onDelete: "set null",
  }),
  featuredImage: varchar("featured_image", { length: 500 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Articles ↔ Tags (M2M Junction)
// ============================================
export const articlesTags = pgTable(
  "articles_tags",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

// ============================================
// Relations (for Drizzle query API `with:`)
// ============================================

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  articles: many(articles),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  articlesTags: many(articlesTags),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  tags: many(articlesTags),
}));

export const articlesTagsRelations = relations(articlesTags, ({ one }) => ({
  article: one(articles, {
    fields: [articlesTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articlesTags.tagId],
    references: [tags.id],
  }),
}));

// ============================================
// Type exports
// ============================================
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ArticleWithRelations = Article & {
  category: Category | null;
  tags: Tag[];
  author: Author | null;
};
