"use strict"

const tap = require("tap")
const supertest = require("supertest")

// 🔥 IMPORTANT: mock BEFORE requiring app
const path = require("path")
const mockNewsApi = require("./mocks/mockNewsApi")

const newsApiPath = path.resolve(__dirname, "../src/config/newsApi.js")
require.cache[newsApiPath] = {
  exports: mockNewsApi,
}

const app = require("../app")
const { connectDB, closeDB, clearDB } = require("./setup")

const request = supertest(app)

let token

tap.before(async () => {
  await connectDB()
})

tap.beforeEach(async () => {
  await clearDB()

  const res = await request.post("/api/auth/register").send({
    name: "News User",
    email: `news_${Date.now()}@test.com`,
    password: "TestPass@123",
  })

  token = res.body.data.token
})

tap.teardown(async () => {
  await closeDB()
})

tap.test("News APIs", async (t) => {

  await t.test("Get news", async (t) => {
    const res = await request
      .get("/api/news")
      .set("Authorization", `Bearer ${token}`)

    t.equal(res.status, 200)
    t.ok(Array.isArray(res.body.data.articles))
  })

  await t.test("Top headlines", async (t) => {
    const res = await request
      .get("/api/news/top-headlines")
      .set("Authorization", `Bearer ${token}`)

    t.equal(res.status, 200)
    t.ok(res.body.data.articles.length > 0)
  })

  await t.test("Search news", async (t) => {
    const res = await request
      .get("/api/news/search/tech")
      .set("Authorization", `Bearer ${token}`)

    t.equal(res.status, 200)
    t.ok(res.body.data.articles.length > 0)
  })

  t.end()
})