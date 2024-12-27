const express = require("express");
const {
  getUser,
  editUser,
  getUserById,
  getAllMembers,
} = require("../controllers/memberController");

const router = express.Router();

// Auth Routes
router.get("/all", getAllMembers);
router.get("/", getUser);
router.get("/:_id", getUserById);
router.put("/", editUser);

module.exports = router;
