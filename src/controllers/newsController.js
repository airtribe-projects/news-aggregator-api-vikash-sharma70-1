const newsService = require("../services/newsService")
const cache = require("../services/cacheService") // NEW
const asyncHandler = require("../utils/asyncHandler")
const { sendSuccess } = require("../utils/responseHandler")

// GET /api/news
exports.getNews = asyncHandler(async (req, res) => {
  const result = await newsService.getNewsByPreferences(req.user._id, req.query)

  res.set("X-Cache", result.fromCache ? "HIT" : "MISS")

  sendSuccess(res, 200, "News fetched successfully", result)
})

// GET /api/news/top-headlines
exports.getTopHeadlines = asyncHandler(async (req, res) => {
  const result = await newsService.getTopHeadlines(req.user._id, req.query)

  res.set("X-Cache", result.fromCache ? "HIT" : "MISS")

  sendSuccess(res, 200, "Top headlines fetched successfully", result)
})

// GET /api/news/search/:keyword
exports.searchNews = asyncHandler(async (req, res) => {
  const { keyword } = req.params
  const result = await newsService.searchNews(keyword, req.query)

  res.set("X-Cache", result.fromCache ? "HIT" : "MISS")

  sendSuccess(res, 200, "Search results fetched successfully", result)
})

// GET /api/news/cache-stats 
exports.getCacheStats = asyncHandler(async (req, res) => {
  const stats = cache.getStats()
  sendSuccess(res, 200, "Cache stats fetched", { stats })
})