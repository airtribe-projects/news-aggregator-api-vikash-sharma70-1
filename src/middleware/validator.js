const AppError = require("../utils/AppError")
const {
  VALID_CATEGORIES,
  VALID_LANGUAGES,
  VALID_COUNTRIES,
} = require("../models/preferenceModel")

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const VALID_SORT_BY = ["relevancy", "popularity", "publishedAt"]
const VALID_PAGE_SIZE = { min: 1, max: 100 }

const sanitizeString = (str) => {
  if (typeof str !== "string") return str
  return str
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

const isPositiveInteger = (value) => {
  const num = parseInt(value)
  return !isNaN(num) && num > 0 && num.toString() === value.toString()
}

const isValidDate = (dateStr) => {
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date)
}

// ═══════════════════════════════════════════════════════
// AUTH VALIDATORS
// ═══════════════════════════════════════════════════════

const validateRegister = (req, res, next) => {
  let { name, email, password } = req.body

  // ── Name ──────────────────────────────────────────────
  if (!name || typeof name !== "string" || name.trim() === "") {
    return next(new AppError("Name is required", 400))
  }

  name = sanitizeString(name)

  if (name.length < 2) {
    return next(new AppError("Name must be at least 2 characters long", 400))
  }
  if (name.length > 50) {
    return next(new AppError("Name cannot exceed 50 characters", 400))
  }

  // ── Email ─────────────────────────────────────────────
  if (!email || typeof email !== "string" || email.trim() === "") {
    return next(new AppError("Email is required", 400))
  }

  email = email.trim().toLowerCase()

  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError("Please provide a valid email address", 400))
  }

  // ── Password ──────────────────────────────────────────
  if (!password || typeof password !== "string") {
    return next(new AppError("Password is required", 400))
  }
  if (password.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400))
  }
  if (password.length > 128) {
    return next(new AppError("Password is too long (max 128 characters)", 400))
  }

  req.body.name = name
  req.body.email = email

  next()
}

const validateLogin = (req, res, next) => {
  let { email, password } = req.body

  if (!email || typeof email !== "string" || email.trim() === "") {
    return next(new AppError("Email is required", 400))
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return next(new AppError("Please provide a valid email address", 400))
  }
  if (!password || typeof password !== "string") {
    return next(new AppError("Password is required", 400))
  }

  req.body.email = email.trim().toLowerCase()

  next()
}

// ═══════════════════════════════════════════════════════
// PREFERENCE VALIDATORS
// ═══════════════════════════════════════════════════════

const validatePreferences = (req, res, next) => {
  const { categories, languages, countries } = req.body

  if (
    categories === undefined &&
    languages === undefined &&
    countries === undefined
  ) {
    return next(
      new AppError(
        "Provide at least one field to update: categories, languages, or countries",
        400
      )
    )
  }

  // ── Categories ────────────────────────────────────────
  if (categories !== undefined) {
    if (!Array.isArray(categories)) {
      return next(new AppError("Categories must be an array", 400))
    }
    if (categories.length === 0) {
      return next(new AppError("Categories array cannot be empty", 400))
    }
    // Duplicates check
    const uniqueCategories = [...new Set(categories)]
    if (uniqueCategories.length !== categories.length) {
      return next(new AppError("Categories cannot contain duplicates", 400))
    }
    const invalidCategories = categories.filter(
      (c) => typeof c !== "string" || !VALID_CATEGORIES.includes(c)
    )
    if (invalidCategories.length > 0) {
      return next(
        new AppError(
          `Invalid categories: [${invalidCategories.join(", ")}]. Valid: ${VALID_CATEGORIES.join(", ")}`,
          400
        )
      )
    }
  }

  // ── Languages ─────────────────────────────────────────
  if (languages !== undefined) {
    if (!Array.isArray(languages)) {
      return next(new AppError("Languages must be an array", 400))
    }
    if (languages.length === 0) {
      return next(new AppError("Languages array cannot be empty", 400))
    }
    const uniqueLangs = [...new Set(languages)]
    if (uniqueLangs.length !== languages.length) {
      return next(new AppError("Languages cannot contain duplicates", 400))
    }
    const invalidLanguages = languages.filter(
      (l) => typeof l !== "string" || !VALID_LANGUAGES.includes(l)
    )
    if (invalidLanguages.length > 0) {
      return next(
        new AppError(
          `Invalid languages: [${invalidLanguages.join(", ")}]. Valid: ${VALID_LANGUAGES.join(", ")}`,
          400
        )
      )
    }
  }

  // ── Countries ─────────────────────────────────────────
  if (countries !== undefined) {
    if (!Array.isArray(countries)) {
      return next(new AppError("Countries must be an array", 400))
    }
    if (countries.length === 0) {
      return next(new AppError("Countries array cannot be empty", 400))
    }
    const uniqueCountries = [...new Set(countries)]
    if (uniqueCountries.length !== countries.length) {
      return next(new AppError("Countries cannot contain duplicates", 400))
    }
    const invalidCountries = countries.filter(
      (c) => typeof c !== "string" || !VALID_COUNTRIES.includes(c)
    )
    if (invalidCountries.length > 0) {
      return next(
        new AppError(
          `Invalid countries: [${invalidCountries.join(", ")}]. Valid: ${VALID_COUNTRIES.join(", ")}`,
          400
        )
      )
    }
  }

  next()
}

// ═══════════════════════════════════════════════════════
// NEWS QUERY VALIDATORS
// ═══════════════════════════════════════════════════════

const validateNewsQuery = (req, res, next) => {
  const { pageSize, page, sortBy, language, from, to } = req.query

  // ── pageSize ──────────────────────────────────────────
  if (pageSize !== undefined) {
    if (!isPositiveInteger(pageSize)) {
      return next(new AppError("pageSize must be a positive integer", 400))
    }
    const size = parseInt(pageSize)
    if (size < VALID_PAGE_SIZE.min || size > VALID_PAGE_SIZE.max) {
      return next(
        new AppError(
          `pageSize must be between ${VALID_PAGE_SIZE.min} and ${VALID_PAGE_SIZE.max}`,
          400
        )
      )
    }
  }

  // ── page ──────────────────────────────────────────────
  if (page !== undefined && !isPositiveInteger(page)) {
    return next(new AppError("page must be a positive integer", 400))
  }

  // ── sortBy ────────────────────────────────────────────
  if (sortBy !== undefined && !VALID_SORT_BY.includes(sortBy)) {
    return next(
      new AppError(
        `sortBy must be one of: ${VALID_SORT_BY.join(", ")}`,
        400
      )
    )
  }

  // ── language ──────────────────────────────────────────
  if (language !== undefined && !VALID_LANGUAGES.includes(language)) {
    return next(
      new AppError(
        `language must be one of: ${VALID_LANGUAGES.join(", ")}`,
        400
      )
    )
  }

  // ── Date range ────────────────────────────────────────
  if (from !== undefined && !isValidDate(from)) {
    return next(
      new AppError("from must be a valid date (e.g., 2024-01-15)", 400)
    )
  }
  if (to !== undefined && !isValidDate(to)) {
    return next(
      new AppError("to must be a valid date (e.g., 2024-01-15)", 400)
    )
  }

  if (from && to && new Date(from) > new Date(to)) {
    return next(new AppError("from date must be before to date", 400))
  }

  next()
}

// ─── SEARCH KEYWORD VALIDATOR ─────────────────────────
const validateSearchKeyword = (req, res, next) => {
  const { keyword } = req.params

  if (!keyword || keyword.trim() === "") {
    return next(new AppError("Search keyword is required", 400))
  }
  if (keyword.trim().length < 2) {
    return next(
      new AppError("Search keyword must be at least 2 characters", 400)
    )
  }
  if (keyword.trim().length > 100) {
    return next(
      new AppError("Search keyword cannot exceed 100 characters", 400)
    )
  }

  // Sanitize keyword
  req.params.keyword = sanitizeString(keyword)

  next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validatePreferences,
  validateNewsQuery,
  validateSearchKeyword,
}