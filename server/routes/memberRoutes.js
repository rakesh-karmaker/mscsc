const express = require("express");
const {
  getMemberById,
  editMember,
  getAllMembers,
  verifyUser,
  deleteMember,
} = require("../controllers/memberController");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// Auth Routes
router.get("/all", getAllMembers);
router.get("/", isAuthorized, verifyUser);
router.get("/:_id", getMemberById);
router.put("/", isAuthorized, upload.single("image"), editMember);
router.delete("/", isAuthorized, isAdmin, deleteMember);

module.exports = router;
