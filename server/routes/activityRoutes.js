const express = require("express");
const {
  getAllActivities,
  addActivity,
  editActivity,
  deleteActivity,
  getActivity,
  getAllEvents,
  getAllArticles,
} = require("../controllers/activityController");
const { isAdmin, isAuthorized } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// Event Routes
router.get("/", getAllActivities);
router.get("/events", getAllEvents);
router.get("/articles", getAllArticles);
router.get("/:slug", getActivity);

router.post(
  "/",
  isAuthorized,
  isAdmin,
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  addActivity
);
router.put(
  "/",
  isAuthorized,
  isAdmin,
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  editActivity
);

router.delete("/", isAuthorized, isAdmin, deleteActivity);

module.exports = router;
