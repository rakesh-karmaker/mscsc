const express = require("express");
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Event Routes
router.get("/", getEvents);
router.post("/", isAdmin, addEvent);
router.put("/:id", isAdmin, updateEvent);
router.delete("/:id", isAdmin, deleteEvent);

module.exports = router;
