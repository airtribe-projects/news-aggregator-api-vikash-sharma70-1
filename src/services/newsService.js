const newsApiClient = require("../config/newsApi")
const { getUserPreferences } = require("./preferenceService")
const cache = require("./cacheService")
const AppError = require("../utils/AppError")

const CACHE_TTL = 5 * 60 // 300 seconds

const formatArticle = (article, index) => ({

  id: Buffer.from(article.url || `article-${index}`).toString("base64url"),
  title: article.title,
  description: article.description,
  content: article.content,
  url: article.url,
  urlToImage: article.urlToImage,
  source: article.source?.name || "Unknown",
  author: article.author || "Unknown",
  publishedAt: article.publishedAt,
})

const buildCacheKey = (prefix, userId, params) => {
  const paramStr = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b)) 
    .map(([k, v]) => `${k}=${v}`)
    .join("_")
  return `${prefix}_${userId}_${paramStr}`
}

// ─── GET NEWS BY PREFERENCES ──────────────────────────
const getNewsByPreferences = async (userId, query = {}) => {
  const preferences = await getUserPreferences(userId)

  const params = {
    language: query.language || preferences.languages[0] || "en",
    pageSize: Math.min(parseInt(query.pageSize) || 10, 100),
    page: parseInt(query.page) || 1,
    q: preferences.categories.join(" OR ") || "general",
  }

  if (query.from) params.from = query.from
  if (query.to) params.to = query.to
  if (query.sortBy) params.sortBy = query.sortBy

  const cacheKey = buildCacheKey("news", userId, params)
  const cachedData = await cache.get(cacheKey)

  if (cachedData) {
    return { ...cachedData, fromCache: true }
  }

  const response = await newsApiClient.get("/everything", { params })

  const result = {
    totalResults: response.data.totalResults,
    currentPage: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(response.data.totalResults / params.pageSize),
    preferences: {
      categories: preferences.categories,
      language: params.language,
    },
    articles: response.data.articles.map(formatArticle),
    fromCache: false,
  }

  await cache.set(cacheKey, result, CACHE_TTL)

  return result
}

// ─── GET TOP HEADLINES ─────────────────────────────────
const getTopHeadlines = async (userId, query = {}) => {
  const preferences = await getUserPreferences(userId)

  const params = {
    country: query.country || preferences.countries[0] || "in",
    pageSize: Math.min(parseInt(query.pageSize) || 10, 100),
    page: parseInt(query.page) || 1,
  }

  if (query.category) params.category = query.category
  else if (preferences.categories[0] !== "general") {
    params.category = preferences.categories[0]
  }

  // ── Cache check ─────────────────────────────────────
  const cacheKey = buildCacheKey("headlines", userId, params)
  const cachedData = await cache.get(cacheKey)

  if (cachedData) {
    return { ...cachedData, fromCache: true }
  }

  const response = await newsApiClient.get("/top-headlines", { params })

  if (response.data.totalResults === 0) {
    throw new AppError(
      "No headlines found for your preferences. Try updating them.",
      404
    )
  }

  const result = {
    totalResults: response.data.totalResults,
    currentPage: params.page,
    pageSize: params.pageSize,
    country: params.country,
    category: params.category || "all",
    articles: response.data.articles.map(formatArticle),
    fromCache: false,
  }

  await cache.set(cacheKey, result, CACHE_TTL)

  return result
}

// ─── SEARCH NEWS ───────────────────────────────────────
const searchNews = async (keyword, query = {}) => {
  if (!keyword || keyword.trim() === "") {
    throw new AppError("Search keyword is required", 400)
  }

  const params = {
    q: keyword.trim(),
    language: query.language || "en",
    pageSize: Math.min(parseInt(query.pageSize) || 10, 100),
    page: parseInt(query.page) || 1,
    sortBy: query.sortBy || "publishedAt",
  }

  if (query.from) params.from = query.from
  if (query.to) params.to = query.to

  // ── Cache check ─────────────────────────────────────
  const cacheKey = buildCacheKey("search", keyword, params)
  const cachedData = await cache.get(cacheKey)

  if (cachedData) {
    return { ...cachedData, fromCache: true }
  }

  const response = await newsApiClient.get("/everything", { params })

  if (response.data.totalResults === 0) {
    throw new AppError(`No articles found for keyword: "${keyword}"`, 404)
  }

  const result = {
    totalResults: response.data.totalResults,
    currentPage: params.page,
    pageSize: params.pageSize,
    keyword: keyword.trim(),
    articles: response.data.articles.map(formatArticle),
    fromCache: false,
  }

  await cache.set(cacheKey, result, CACHE_TTL)

  return result
}

module.exports = {
  getNewsByPreferences,
  getTopHeadlines,
  searchNews,
}