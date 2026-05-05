const preferenceService = require("../services/preferenceService")
const asyncHandler = require("../utils/asyncHandler")
const { sendSuccess } = require("../utils/responseHandler")

// GET /api/preferences
exports.getPreferences = asyncHandler(async (req, res) => {
  const preferences = await preferenceService.getUserPreferences(req.user._id)

  sendSuccess(res, 200, "Preferences fetched successfully", { preferences })
})

// PUT /api/preferences
exports.updatePreferences = asyncHandler(async (req, res) => {
  const { categories, languages, countries } = req.body

  const preferences = await preferenceService.updateUserPreferences(
    req.user._id,
    { categories, languages, countries }
  )

  sendSuccess(res, 200, "Preferences updated successfully", { preferences })
})