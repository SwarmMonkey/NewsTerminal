import { createError, defineEventHandler, getRouterParam, readBody } from "h3"
import { deleteArticle, getArticleById, updateArticle } from "../../api/articles"

// GET /api/articles/:id - Get article by ID
export const GET = defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare.env
    const id = Number.parseInt(getRouterParam(event, "id") || "", 10)

    if (Number.isNaN(id)) {
      return createError({
        statusCode: 400,
        statusMessage: "Invalid article ID",
      })
    }

    const article = await getArticleById(env, id)
    return article
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error && error.message === "Article not found") {
      return createError({
        statusCode: 404,
        statusMessage: "Article not found",
      })
    }

    console.error("Error fetching article:", error)
    return createError({
      statusCode: 500,
      statusMessage: "Failed to fetch article",
    })
  }
})

// PUT /api/articles/:id - Update article
export const PUT = defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare.env
    const id = Number.parseInt(getRouterParam(event, "id") || "", 10)
    const body = await readBody(event)

    if (Number.isNaN(id)) {
      return createError({
        statusCode: 400,
        statusMessage: "Invalid article ID",
      })
    }

    const response = await updateArticle(env, id, body)
    return response
  } catch (error) {
    console.error("Error updating article:", error)
    return createError({
      statusCode: 500,
      statusMessage: "Failed to update article",
    })
  }
})

// DELETE /api/articles/:id - Delete article
export const DELETE = defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare.env
    const id = Number.parseInt(getRouterParam(event, "id") || "", 10)

    if (Number.isNaN(id)) {
      return createError({
        statusCode: 400,
        statusMessage: "Invalid article ID",
      })
    }

    const response = await deleteArticle(env, id)
    return response
  } catch (error) {
    console.error("Error deleting article:", error)
    return createError({
      statusCode: 500,
      statusMessage: "Failed to delete article",
    })
  }
})
