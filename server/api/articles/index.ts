import { createError, defineEventHandler, readBody } from "h3"
import { createArticle, getArticles } from "../../api/articles"

// GET /api/articles - Get all articles
export const GET = defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare.env
    const response = await getArticles(env)
    return response
  } catch (error) {
    console.error("Error fetching articles:", error)
    return createError({
      statusCode: 500,
      statusMessage: "Failed to fetch articles",
    })
  }
})

// POST /api/articles - Create a new article
export const POST = defineEventHandler(async (event) => {
  try {
    const env = event.context.cloudflare.env
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.content || !body.published_at) {
      return createError({
        statusCode: 400,
        statusMessage: "Missing required fields: title, content, or published_at",
      })
    }

    const response = await createArticle(env, body)
    return response
  } catch (error) {
    console.error("Error creating article:", error)
    return createError({
      statusCode: 500,
      statusMessage: "Failed to create article",
    })
  }
})
