const logger = (req, res, next) => {
  const start = Date.now() 

  res.on("finish", () => {
    const duration = Date.now() - start
    const log = [
      `[${new Date().toISOString()}]`, // Timestamp
      req.method,                       // GET/POST/PUT/DELETE
      req.originalUrl,                  // /api/auth/register
      `-`,
      res.statusCode,                 
      `-`,
      `${duration}ms`,                  
    ].join(" ")

    if (res.statusCode >= 500) {
      console.error(`${log}`)
    } else if (res.statusCode >= 400) {
      console.warn(`${log}`)
    } else {
      console.log(`${log}`)
    }
  })

  next() 
}

module.exports = logger