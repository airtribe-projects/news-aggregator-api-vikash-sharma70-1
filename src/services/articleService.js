const Article = require("../models/articleModel")
const AppError = require("../utils/AppError")

// ─── ARTICLE MARK AS READ ─────────────────────────────
const markAsRead = async (userId, articleId, articleData) => {

  if (!articleData || !articleData.url || !articleData.title) {
    throw new AppError(
      "Article data (title, url) is required to mark as read",
      400
    )
  }
  const article = await Article.findOneAndUpdate(
    { userId, articleId },    
    {
      $set: {
        isRead: true,
        title: articleData.title,
        description: articleData.description || "",
        url: articleData.url,
        urlToImage: articleData.urlToImage || null,
        source: articleData.source || "Unknown",
        author: articleData.author || "Unknown",
        publishedAt: articleData.publishedAt || null,
      },
    },
    {
      new: true,   
      upsert: true, // create if not found
      runValidators: true,
    }
  )

  return article
}

// ─── ARTICLE MARK AS FAVORITE ─────────────────────────
const markAsFavorite = async (userId, articleId, articleData) => {
  if (!articleData || !articleData.url || !articleData.title) {
    throw new AppError(
      "Article data (title, url) is required to mark as favorite",
      400
    )
  }

  // Toggle favorite 
  const existing = await Article.findOne({ userId, articleId })

  const newFavoriteStatus = existing ? !existing.isFavorite : true

  const article = await Article.findOneAndUpdate(
    { userId, articleId },
    {
      $set: {
        isFavorite: newFavoriteStatus,
        title: articleData.title,
        description: articleData.description || "",
        url: articleData.url,
        urlToImage: articleData.urlToImage || null,
        source: articleData.source || "Unknown",
        author: articleData.author || "Unknown",
        publishedAt: articleData.publishedAt || null,
      },
    },
    { new: true, upsert: true, runValidators: true }
  )

  return {
    article,
    message: newFavoriteStatus
      ? "Article added to favorites"
      : "Article removed from favorites",
  }
}

// ─── GET ALL READ ARTICLES ────────────────────────────
const getReadArticles = async (userId) => {
  const articles = await Article.find({
    userId,
    isRead: true,
  }).sort({ updatedAt: -1 }) // Latest first

  return articles
}

// ─── GET ALL FAVORITE ARTICLES ───────────────────────
const getFavoriteArticles = async (userId) => {
  const articles = await Article.find({
    userId,
    isFavorite: true,
  }).sort({ updatedAt: -1 })

  return articles
}

module.exports = {
  markAsRead,
  markAsFavorite,
  getReadArticles,
  getFavoriteArticles,
}