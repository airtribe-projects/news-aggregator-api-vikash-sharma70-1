const authService = require("../services/authService")
const asyncHandler = require("../utils/asyncHandler")
const { sendSuccess } = require("../utils/responseHandler")

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const { user, token } = await authService.registerUser({
    name,
    email,
    password,
  })

  sendSuccess(res, 201, "Registration successful", { user, token })
})

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const { user, token } = await authService.loginUser({ email, password })

  sendSuccess(res, 200, "Login successful", { user, token })
})