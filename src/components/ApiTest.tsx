import { useEffect, useState } from "react"
import { getArticles } from "../api/articles"

export default function ApiTest() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getArticles()
        setArticles(data.articles || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setError("Failed to fetch articles. See console for details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>

      {loading && <div className="text-blue-500">Loading articles...</div>}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!loading && !error && articles.length === 0 && (
        <div className="text-yellow-500 mb-4">
          No articles found. The API connection works, but there are no articles in the database yet.
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <div className="text-green-500 mb-4">
            Successfully connected to API and fetched
            {" "}
            {articles.length}
            {" "}
            articles!
          </div>

          <ul className="space-y-4">
            {articles.map(article => (
              <li key={article.id} className="border p-3 rounded">
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-gray-600 text-sm">{new Date(article.published_at).toLocaleString()}</p>
                <p className="mt-2">
                  {article.content.substring(0, 100)}
                  ...
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
