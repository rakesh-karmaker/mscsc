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
const router = express.Router();

router.get("/", getAllTasks);
router.get("/:slug", getTask);
router.post("/create", createTask);
router.put("/edit-task", editTask);
router.delete("/delete-task", deleteTask);
router.post("/submit", submitTask);
router.put("/edit-submission", editSubmission);
router.delete("/delete-submission", deleteSubmission);
router.put("/make-champion", makeChampion);
router.delete("/delete-champion", deleteChampion);

module.exports = router;
