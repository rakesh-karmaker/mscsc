const express = require("express");
const {
  createMessage,
  getAllMessages,
  deleteMessage,
} = require("../controllers/messageController");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", isAuthorized, isAdmin, getAllMessages);
router.post("/", createMessage);
router.delete("/", isAuthorized, isAdmin, deleteMessage);

module.exports = router;
