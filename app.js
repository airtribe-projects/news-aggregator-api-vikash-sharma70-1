require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const logger = require("./src/middleware/logger")
const errorHandler = require("./src/middleware/errorHandler")
const AppError = require("./src/utils/AppError")
const { globalLimiter } = require("./src/middleware/rateLimiter")

const authRoutes = require("./src/routes/authRoutes")
const newsRoutes = require("./src/routes/newsRoutes")
const preferenceRoutes = require("./src/routes/preferenceRoutes")

const app = express()

// Security
app.use(helmet())
app.use(cors())

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.use("/api", globalLimiter)

// Body Parser
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))

// Logger
app.use(logger)

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "News Aggregator API is running",
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/preferences", preferenceRoutes)

// 404
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404))
})

// Global Error Handler
app.use(errorHandler)

module.exports = app