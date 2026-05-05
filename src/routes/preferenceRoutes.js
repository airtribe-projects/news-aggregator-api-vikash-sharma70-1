const express = require("express")
const router = express.Router()
const preferenceController = require("../controllers/preferenceController")
const { protect } = require("../middleware/authMiddleware")
const { validatePreferences } = require("../middleware/validator")

router.get("/", protect, preferenceController.getPreferences)
router.put("/", protect, validatePreferences, preferenceController.updatePreferences)

module.exports = router