import type { SourceID, SourceResponse } from "@shared/types"
import sources from "@shared/sources"
import { createError, defineEventHandler, readBody } from "h3"
import { getCacheTable } from "#/database/cache"

export default defineEventHandler(async (event) => {
  try {
    const { sources: _ }: { sources: SourceID[] } = await readBody(event)
    const cacheTable = await getCacheTable()
    const ids = _?.filter(k => sources[k])
    if (ids?.length && cacheTable) {
      const caches = await cacheTable.getEntire(ids)
      const now = Date.now()
      return caches.map(cache => ({
        status: "cache",
        id: cache.id,
        items: cache.items,
        updatedTime: now - cache.updated < sources[cache.id].interval ? now : cache.updated,
      })) as SourceResponse[]
    }
  } catch (e) {
    // Log the error for better debugging
    console.error("Error fetching sources:", e)
    throw createError({
      statusCode: 500,
      message: e instanceof Error ? e.message : "Internal Server Error",
    })
  }
})
