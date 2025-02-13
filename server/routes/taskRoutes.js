const express = require("express");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");
const {
  createTask,
  editTask,
  submitTask,
  editSubmission,
  deleteSubmission,
  makeChampion,
  deleteChampion,
  deleteTask,
  getAllTasks,
  getTask,
} = require("../controllers/taskController");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/", isAuthorized, getAllTasks);
router.get("/:slug", isAuthorized, getTask);
router.post("/create", isAuthorized, isAdmin, createTask);
router.put("/edit-task", isAuthorized, isAdmin, editTask);
router.delete("/delete-task", isAuthorized, isAdmin, deleteTask);

router.post("/submit", isAuthorized, upload.single("poster"), submitTask);
router.put(
  "/edit-submission",
  isAuthorized,
  upload.single("poster"),
  editSubmission
);
router.delete("/delete-submission", isAuthorized, deleteSubmission);

router.put("/make-champion", isAuthorized, isAdmin, makeChampion);
router.delete("/delete-champion", isAuthorized, isAdmin, deleteChampion);

module.exports = router;
