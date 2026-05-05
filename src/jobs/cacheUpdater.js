const newsApiClient = require("../config/newsApi")
const cache = require("../services/cacheService")
const { Preference } = require("../models/preferenceModel")

const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes
const CACHE_TTL = 12 * 60              // 12 minutes 

const refreshUserCache = async (preference) => {
  try {
    const params = {
      q: preference.categories.join(" OR ") || "general",
      language: preference.languages[0] || "en",
      pageSize: 10,
      page: 1,
    }

    const cacheKey = `news_${preference.userId}_language=${params.language}_page=${params.page}_pageSize=${params.pageSize}_q=${params.q}`

    if (!cache.has(cacheKey)) {
      return
    }

    console.log(`Refreshing cache for user: ${preference.userId}`)

    const response = await newsApiClient.get("/everything", { params })

    const refreshedData = {
      totalResults: response.data.totalResults,
      currentPage: 1,
      pageSize: 10,
      articles: response.data.articles.map((article, index) => ({
        id: Buffer.from(article.url || `article-${index}`).toString("base64url"),
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        source: article.source?.name || "Unknown",
        author: article.author || "Unknown",
        publishedAt: article.publishedAt,
      })),
      fromCache: false,
      refreshedAt: new Date().toISOString(),
    }

    await cache.set(cacheKey, refreshedData, CACHE_TTL)
    console.log(`Cache refreshed for user: ${preference.userId}`)
  } catch (error) {
    console.error(
      `Cache refresh failed for user ${preference.userId}:`,
      error.message
    )
  }
}

const refreshAllCaches = async () => {
  console.log("Starting periodic cache refresh...")

  try {
    const preferences = await Preference.find({})

    if (preferences.length === 0) {
      console.log("No preferences found, skipping cache refresh")
      return
    }

    console.log(`Refreshing cache for ${preferences.length} users`)

    for (const preference of preferences) {
      await refreshUserCache(preference)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log("Periodic cache refresh completed")
  } catch (error) {
    console.error("Periodic cache refresh failed:", error.message)
  }
}

// ─── JOB START ───────────────────────────────────
const startCacheUpdater = () => {
  console.log(
    `Cache updater started - refreshing every ${REFRESH_INTERVAL / 60000} minutes`
  )

  setTimeout(refreshAllCaches, 10000) 

  const intervalId = setInterval(refreshAllCaches, REFRESH_INTERVAL)

  process.on("SIGTERM", () => clearInterval(intervalId))
  process.on("SIGINT", () => clearInterval(intervalId))

  return intervalId
}

module.exports = { startCacheUpdater, refreshAllCaches }