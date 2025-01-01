const express = require("express");
const {
  getAllActivities,
  addActivity,
  editActivity,
  deleteActivity,
} = require("../controllers/activityController");
const { isAdmin, isAuthorized } = require("../middleware/authMiddleware");
const { uploadSingle } = require("../middleware/multer");

const router = express.Router();

// Event Routes
router.get("/", getAllActivities);
router.post(
  "/",
  isAuthorized,
  isAdmin,
  uploadSingle("activities").single("activityImage"),
  addActivity
);
router.put(
  "/",
  isAuthorized,
  isAdmin,
  uploadSingle("activities").single("activityImage"),
  editActivity
);
router.delete("/", isAuthorized, isAdmin, deleteActivity);

module.exports = router;
