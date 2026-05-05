const mongoose = require("mongoose")

const VALID_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
]

const VALID_LANGUAGES = [
  "en", // English
  "hi", // Hindi
  "ar", // Arabic
  "de", // German
  "es", // Spanish
  "fr", // French
]

const VALID_COUNTRIES = [
  "in", // India
  "us", // United States
  "gb", // Great Britain
  "au", // Australia
  "ca", // Canada
]

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      
      required: true,
      unique: true,    
    },

    categories: {
      type: [String],
      enum: {
        values: VALID_CATEGORIES,
        message: "{VALUE} is not a valid category",
      },
      default: ["general"],
    },

    languages: {
      type: [String],
      enum: {
        values: VALID_LANGUAGES,
        message: "{VALUE} is not a valid language",
      },
      default: ["en"],
    },

    countries: {
      type: [String],
      enum: {
        values: VALID_COUNTRIES,
        message: "{VALUE} is not a valid country",
      },
      default: ["in"],
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

const Preference = mongoose.model("Preference", preferenceSchema)

module.exports = { Preference, VALID_CATEGORIES, VALID_LANGUAGES, VALID_COUNTRIES }