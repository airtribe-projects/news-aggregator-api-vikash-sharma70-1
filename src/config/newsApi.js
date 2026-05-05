const axios = require("axios")
const AppError = require("../utils/AppError")

const newsApiClient = axios.create({
  baseURL: process.env.NEWS_API_BASE_URL, 
  timeout: 10000,                         
  headers: {
    "X-Api-Key": process.env.NEWS_API_KEY, 
    "Content-Type": "application/json",
  },
})

newsApiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || "News API error occurred"

      if (status === 401) {
        throw new AppError(
          "News API authentication failed. Check your API key.",
          500 
        )
      }
      if (status === 429) {
        throw new AppError(
          "News API rate limit exceeded. Please try again later.",
          429
        )
      }
      if (status === 400) {
        throw new AppError(`Invalid request to News API: ${message}`, 400)
      }

      throw new AppError(`News API error: ${message}`, 502)
    }

    if (error.code === "ECONNABORTED") {
      throw new AppError(
        "News API request timed out. Please try again.",
        504  
      )
    }

    throw new AppError("Failed to connect to News API.", 502)
  }
)

module.exports = newsApiClient