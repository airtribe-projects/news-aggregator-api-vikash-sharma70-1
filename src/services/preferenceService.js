const { Preference } = require("../models/preferenceModel")
const AppError = require("../utils/AppError")

// ─── GET PREFERENCES ───────────────────────────────────
const getUserPreferences = async (userId) => {
  let preferences = await Preference.findOne({ userId })

  if (!preferences) {
    preferences = await Preference.create({
      userId,
      categories: ["general"],
      languages: ["en"],
      countries: ["in"],
    })
  }

  return preferences
}

// ─── UPDATE PREFERENCES ────────────────────────────────
const updateUserPreferences = async (userId, updates) => {
  const { categories, languages, countries } = updates

  const updateFields = {}
  if (categories !== undefined) updateFields.categories = categories
  if (languages !== undefined) updateFields.languages = languages
  if (countries !== undefined) updateFields.countries = countries

  const preferences = await Preference.findOneAndUpdate(
    { userId },          
    { $set: updateFields }, 
    {
      new: true,         
      upsert: true,      
      runValidators: true, 
    }
  )

  return preferences
}

module.exports = { getUserPreferences, updateUserPreferences }