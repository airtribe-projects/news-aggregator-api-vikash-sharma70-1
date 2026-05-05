"use strict"

const tap = require("tap")
const supertest = require("supertest")
const app = require("../app")

const { connectDB, closeDB, clearDB } = require("./setup")

const request = supertest(app)

tap.before(async () => {
  await connectDB()
})

tap.beforeEach(async () => {
  await clearDB()
})

tap.teardown(async () => {
  await closeDB()
})

const createUser = () => ({
  name: "Test User",
  email: `user_${Date.now()}_${Math.random()}@test.com`,
  password: "TestPass@123",
})

tap.test("Auth Flow", async (t) => {

  await t.test("Register user", async (t) => {
    const user = createUser()

    const res = await request.post("/api/auth/register").send(user)

    t.equal(res.status, 201)
    t.ok(res.body.data.token)
  })

  await t.test("Duplicate email", async (t) => {
    const user = createUser()

    await request.post("/api/auth/register").send(user)

    const res = await request.post("/api/auth/register").send(user)

    t.equal(res.status, 409)
  })

  await t.test("Login success", async (t) => {
    const user = createUser()

    await request.post("/api/auth/register").send(user)

    const res = await request.post("/api/auth/login").send(user)

    t.equal(res.status, 200)
    t.ok(res.body.data.token)
  })

  await t.test("Wrong password", async (t) => {
    const user = createUser()

    await request.post("/api/auth/register").send(user)

    const res = await request.post("/api/auth/login").send({
      email: user.email,
      password: "wrong",
    })

    t.equal(res.status, 401)
  })

  t.end()
})