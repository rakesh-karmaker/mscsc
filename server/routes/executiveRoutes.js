const express = require("express");
const {
  getExecutives,
  addExecutive,
  updateExecutive,
  deleteExecutive,
} = require("../controllers/executiveController");
const { isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Executive Routes
router.get("/", getExecutives);
router.post("/", isAdmin, addExecutive);
router.put("/:id", isAdmin, updateExecutive);
router.delete("/:id", isAdmin, deleteExecutive);

module.exports = router;
