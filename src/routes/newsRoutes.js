const express = require("express")
const router = express.Router()
const newsController = require("../controllers/newsController")
const articleController = require("../controllers/articleController") 
const { protect } = require("../middleware/authMiddleware")
const { newsLimiter } = require("../middleware/rateLimiter")
const {
  validateNewsQuery,
  validateSearchKeyword,
} = require("../middleware/validator")

// ── Static routes ─────────────────────────────────────
router.get(
  "/read",
  protect,
  articleController.getReadArticles
)

router.get(
  "/favorites",
  protect,
  articleController.getFavoriteArticles
)

router.get(
  "/top-headlines",
  protect,
  newsLimiter,
  validateNewsQuery,
  newsController.getTopHeadlines
)

router.get(
  "/search/:keyword",
  protect,
  newsLimiter,
  validateSearchKeyword,
  validateNewsQuery,
  newsController.searchNews
)

// ── Main news route ───────────────────────────────────
router.get(
  "/",
  protect,
  newsLimiter,
  validateNewsQuery,
  newsController.getNews
)

// ── Dynamic routes - ALWAYS LAST ─────────────────
router.post(
  "/:id/read",
  protect,
  articleController.markAsRead
)

router.post(
  "/:id/favorite",
  protect,
  articleController.markAsFavorite
)

module.exports = router