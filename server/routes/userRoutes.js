const express = require("express");
const {
  getUser,
  editUser,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

// Auth Routes
router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/", editUser);

module.exports = router;
