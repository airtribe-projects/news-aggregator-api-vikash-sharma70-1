"use strict"

const tap = require("tap")
const supertest = require("supertest")
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
    name: "User",
    email: "user@test.com",
    password: "TestPass@123",
  })

  token = res.body.data.token
})

tap.teardown(async () => {
  await closeDB()
})

tap.test("Preferences", async (t) => {

  await t.test("Get preferences", async (t) => {
    const res = await request
      .get("/api/preferences")
      .set("Authorization", `Bearer ${token}`)

    t.equal(res.status, 200)
  })

  await t.test("Update preferences", async (t) => {
    const res = await request
      .put("/api/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        categories: ["technology"],
        languages: ["en"],
        countries: ["us"],
      })

    t.equal(res.status, 200)
  })

  t.end()
})