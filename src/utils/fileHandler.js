const fs = require("fs/promises")
const path = require("path")

const readJSON = async (filename) => {
  const filePath = path.join(__dirname, "../data", filename)
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data)
}

const writeJSON = async (filename, data) => {
  const filePath = path.join(__dirname, "../data", filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

module.exports = { readJSON, writeJSON }