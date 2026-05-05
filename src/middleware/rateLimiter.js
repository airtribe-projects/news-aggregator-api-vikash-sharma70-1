const rateLimit = require("express-rate-limit")

// ─── AUTH ROUTES LIMITER ───────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10,                   // Only 10 attempts allowed
  standardHeaders: true,     // send RateLimit headers in response 
  legacyHeaders: false,

  // Custom error message
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message:
        "Too many attempts from this IP. Please try again after 15 minutes.",
    })
  },

  skipSuccessfulRequests: false, 
})

// ─── NEWS ROUTES LIMITER ───────────────────────────────
const newsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30,             // 30 requests per minute per user
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many news requests. Please wait a minute before trying again.",
    })
  },
})

// ─── GLOBAL API LIMITER ────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many requests from this IP. Please try again later.",
    })
  },
})

module.exports = { authLimiter, newsLimiter, globalLimiter }