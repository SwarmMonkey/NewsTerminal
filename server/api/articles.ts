import type { D1Database } from "@cloudflare/workers-types"

// Define types for our data
interface Article {
  id?: number
  title: string
  content: string
  source?: string
  published_at: string
  url?: string
  created_at?: string
}

// Get all articles
export async function getArticles(env: { NEWSNOW_DB: D1Database }) {
  try {
    const { results } = await env.NEWSNOW_DB.prepare(
      "SELECT * FROM articles ORDER BY published_at DESC LIMIT 100",
    ).all()

    return {
      articles: results as Article[],
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    throw error
  }
}

// Get article by ID
export async function getArticleById(env: { NEWSNOW_DB: D1Database }, id: number) {
  try {
    const article = await env.NEWSNOW_DB.prepare(
      "SELECT * FROM articles WHERE id = ?",
    )
      .bind(id)
      .first()

    if (!article) {
      throw new Error("Article not found")
    }

    return article as Article
  } catch (error) {
    console.error(`Failed to fetch article with ID ${id}:`, error)
    throw error
  }
}

// Create new article
export async function createArticle(env: { NEWSNOW_DB: D1Database }, article: Article) {
  try {
    const result = await env.NEWSNOW_DB.prepare(
      "INSERT INTO articles (title, content, source, published_at, url) VALUES (?, ?, ?, ?, ?) RETURNING id",
    )
      .bind(
        article.title,
        article.content,
        article.source || null,
        article.published_at,
        article.url || null,
      )
      .run()

    return {
      success: true,
      id: result.results?.[0]?.id,
    }
  } catch (error) {
    console.error("Failed to create article:", error)
    throw error
  }
}

// Update article
export async function updateArticle(env: { NEWSNOW_DB: D1Database }, id: number, article: Partial<Article>) {
  try {
    // Build dynamic update SQL
    const updates = []
    const values = []

    if (article.title) {
      updates.push("title = ?")
      values.push(article.title)
    }

    if (article.content) {
      updates.push("content = ?")
      values.push(article.content)
    }

    if (article.source !== undefined) {
      updates.push("source = ?")
      values.push(article.source)
    }

    if (article.published_at) {
      updates.push("published_at = ?")
      values.push(article.published_at)
    }

    if (article.url !== undefined) {
      updates.push("url = ?")
      values.push(article.url)
    }

    if (updates.length === 0) {
      return { success: false, message: "No fields to update" }
    }

    // Add ID to values
    values.push(id)

    const result = await env.NEWSNOW_DB.prepare(
      `UPDATE articles SET ${updates.join(", ")} WHERE id = ?`,
    )
      .bind(...values)
      .run()

    return {
      success: true,
      updated: result.success,
    }
  } catch (error) {
    console.error(`Failed to update article with ID ${id}:`, error)
    throw error
  }
}

// Delete article
export async function deleteArticle(env: { NEWSNOW_DB: D1Database }, id: number) {
  try {
    const result = await env.NEWSNOW_DB.prepare(
      "DELETE FROM articles WHERE id = ?",
    )
      .bind(id)
      .run()

    return {
      success: true,
      deleted: result.success,
    }
  } catch (error) {
    console.error(`Failed to delete article with ID ${id}:`, error)
    throw error
  }
}
