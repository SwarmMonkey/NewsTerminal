// Cloudflare Worker to serve as API for Vercel frontend
export default {
  async fetch(request, env) {
    // Set up CORS to allow requests from your Vercel domain
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://news-terminal-beta.vercel.app",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    }

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    try {
      const url = new URL(request.url)
      const path = url.pathname

      // Articles endpoint
      if (path.startsWith("/api/articles")) {
        const id = path.match(/\/api\/articles\/(\d+)/)?.[1]

        // GET all articles
        if (path === "/api/articles" && request.method === "GET") {
          const { results } = await env.NEWSNOW_DB.prepare(
            "SELECT * FROM articles ORDER BY published_at DESC LIMIT 100",
          ).all()

          return new Response(JSON.stringify({ articles: results }), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          })
        }

        // GET article by ID
        if (id && request.method === "GET") {
          const article = await env.NEWSNOW_DB.prepare(
            "SELECT * FROM articles WHERE id = ?",
          )
            .bind(Number.parseInt(id, 10))
            .first()

          if (!article) {
            return new Response(JSON.stringify({ error: "Article not found" }), {
              status: 404,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            })
          }

          return new Response(JSON.stringify(article), {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          })
        }

        // POST new article
        if (path === "/api/articles" && request.method === "POST") {
          const body = await request.json()

          // Validate required fields
          if (!body.title || !body.content || !body.published_at) {
            return new Response(
              JSON.stringify({
                error: "Missing required fields: title, content, or published_at",
              }),
              {
                status: 400,
                headers: {
                  ...corsHeaders,
                  "Content-Type": "application/json",
                },
              },
            )
          }

          const result = await env.NEWSNOW_DB.prepare(
            "INSERT INTO articles (title, content, source, published_at, url) VALUES (?, ?, ?, ?, ?) RETURNING id",
          )
            .bind(
              body.title,
              body.content,
              body.source || null,
              body.published_at,
              body.url || null,
            )
            .run()

          return new Response(
            JSON.stringify({
              success: true,
              id: result.results?.[0]?.id,
            }),
            {
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            },
          )
        }

        // PUT update article
        if (id && request.method === "PUT") {
          const body = await request.json()
          const updates = []
          const values = []

          if (body.title) {
            updates.push("title = ?")
            values.push(body.title)
          }

          if (body.content) {
            updates.push("content = ?")
            values.push(body.content)
          }

          if (body.source !== undefined) {
            updates.push("source = ?")
            values.push(body.source)
          }

          if (body.published_at) {
            updates.push("published_at = ?")
            values.push(body.published_at)
          }

          if (body.url !== undefined) {
            updates.push("url = ?")
            values.push(body.url)
          }

          if (updates.length === 0) {
            return new Response(
              JSON.stringify({ success: false, message: "No fields to update" }),
              {
                headers: {
                  ...corsHeaders,
                  "Content-Type": "application/json",
                },
              },
            )
          }

          // Add ID to values
          values.push(Number.parseInt(id, 10))

          const result = await env.NEWSNOW_DB.prepare(
            `UPDATE articles SET ${updates.join(", ")} WHERE id = ?`,
          )
            .bind(...values)
            .run()

          return new Response(
            JSON.stringify({
              success: true,
              updated: result.success,
            }),
            {
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            },
          )
        }

        // DELETE article
        if (id && request.method === "DELETE") {
          const result = await env.NEWSNOW_DB.prepare(
            "DELETE FROM articles WHERE id = ?",
          )
            .bind(Number.parseInt(id, 10))
            .run()

          return new Response(
            JSON.stringify({
              success: true,
              deleted: result.success,
            }),
            {
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            },
          )
        }
      }

      // Categories endpoint could be added here

      // Return 404 for unmatched routes
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      // Handle errors
      console.error("API error:", error)
      return new Response(
        JSON.stringify({ error: "Internal server error", message: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }
  },
}
