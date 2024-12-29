const express = require("express");
const {
  createMessage,
  editMessage,
  getAllMessages,
  deleteMessage,
} = require("../controllers/messageController");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", isAuthorized, isAdmin, getAllMessages);
router.post("/", createMessage);
router.put("/", isAuthorized, isAdmin, editMessage);
router.delete("/", isAuthorized, isAdmin, deleteMessage);

module.exports = router;
