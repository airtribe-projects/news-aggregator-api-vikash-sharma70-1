const User = require("../models/userModel")
const { generateToken } = require("../utils/jwtHelper")
const AppError = require("../utils/AppError")

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new AppError("Email already registered. Please login.", 409)
  }

  const user = await User.create({ name, email, password })

  const token = generateToken(user._id)

  return { user, token }
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    email: email.toLowerCase()
  }).select("+password")

  if (!user) {
    throw new AppError("Invalid email or password", 401)
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401)
  }

  const token = generateToken(user._id)

  return { user, token }
}

module.exports = { registerUser, loginUser }