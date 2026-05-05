const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    articleId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    urlToImage: {
      type: String,
      default: null,
    },

    source: {
      type: String,
      default: "Unknown",
    },

    author: {
      type: String,
      default: "Unknown",
    },

    publishedAt: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v
        return ret
      },
    },
  }
)

articleSchema.index({ userId: 1, articleId: 1 }, { unique: true })

const Article = mongoose.model("Article", articleSchema)

module.exports = Article