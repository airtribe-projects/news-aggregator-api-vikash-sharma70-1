const articleService = require("../services/articleService")
const asyncHandler = require("../utils/asyncHandler")
const { sendSuccess } = require("../utils/responseHandler")

// POST /api/news/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id: articleId } = req.params
  const articleData = req.body

  const article = await articleService.markAsRead(
    req.user._id,
    articleId,
    articleData
  )

  sendSuccess(res, 200, "Article marked as read", { article })
})

// POST /api/news/:id/favorite
exports.markAsFavorite = asyncHandler(async (req, res) => {
  const { id: articleId } = req.params
  const articleData = req.body

  const { article, message } = await articleService.markAsFavorite(
    req.user._id,
    articleId,
    articleData
  )

  sendSuccess(res, 200, message, { article })
})

// GET /api/news/read
exports.getReadArticles = asyncHandler(async (req, res) => {
  const articles = await articleService.getReadArticles(req.user._id)

  sendSuccess(res, 200, "Read articles fetched successfully", {
    count: articles.length,
    articles,
  })
})

// GET /api/news/favorites
exports.getFavoriteArticles = asyncHandler(async (req, res) => {
  const articles = await articleService.getFavoriteArticles(req.user._id)

  sendSuccess(res, 200, "Favorite articles fetched successfully", {
    count: articles.length,
    articles,
  })
})