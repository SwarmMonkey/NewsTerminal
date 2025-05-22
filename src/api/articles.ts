// API client for interacting with Cloudflare Worker from Vercel frontend
import { ofetch } from "ofetch"

// Replace with your actual Cloudflare Worker URL once deployed
const API_BASE_URL = "https://newsnow-api.yourusername.workers.dev"

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

// Create a configured fetch instance
const api = ofetch.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Get all articles
export async function getArticles() {
  try {
    const { articles } = await api("/api/articles")
    return { articles }
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    throw error
  }
}

// Get article by ID
export async function getArticleById(id: number) {
  try {
    const article = await api(`/api/articles/${id}`)
    return article
  } catch (error) {
    console.error(`Failed to fetch article with ID ${id}:`, error)
    throw error
  }
}

// Create new article
export async function createArticle(article: Article) {
  try {
    const result = await api("/api/articles", {
      method: "POST",
      body: article,
    })
    return result
  } catch (error) {
    console.error("Failed to create article:", error)
    throw error
  }
}

// Update article
export async function updateArticle(id: number, article: Partial<Article>) {
  try {
    const result = await api(`/api/articles/${id}`, {
      method: "PUT",
      body: article,
    })
    return result
  } catch (error) {
    console.error(`Failed to update article with ID ${id}:`, error)
    throw error
  }
}

// Delete article
export async function deleteArticle(id: number) {
  try {
    const result = await api(`/api/articles/${id}`, {
      method: "DELETE",
    })
    return result
  } catch (error) {
    console.error(`Failed to delete article with ID ${id}:`, error)
    throw error
  }
}
