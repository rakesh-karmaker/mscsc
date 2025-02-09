const express = require("express");
const {
  getMember,
  editMember,
  getAllMembers,
  verifyUser,
  deleteMember,
  getTopSubmitters,
} = require("../controllers/memberController");
const { isAuthorized, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// Auth Routes
router.get("/all", getAllMembers);
router.get("/", isAuthorized, verifyUser);
router.get("/top-submitters", getTopSubmitters);
router.get("/:slug", getMember);

router.put("/", isAuthorized, upload.single("image"), editMember);
router.delete("/", isAuthorized, isAdmin, deleteMember);

module.exports = router;
