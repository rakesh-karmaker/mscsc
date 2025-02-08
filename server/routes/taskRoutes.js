const express = require("express");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");
const {
  createTask,
  editTask,
  submitTask,
  editSubmission,
  deleteSubmission,
} = require("../controllers/taskController");
const router = express.Router();

router.post("/create", createTask);
router.post("/edit-task", editTask);
router.post("/submit", submitTask);
router.post("/edit-submission", editSubmission);
router.delete("/delete-submission", deleteSubmission);

module.exports = router;
