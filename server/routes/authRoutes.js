const express = require("express");
const { register, login } = require("../controllers/authController");
const uploadSingle = require("../middleware/multer");

const router = express.Router();

// Auth Routes
router.post("/register", uploadSingle.single("image"), register);
router.post("/login", login);

module.exports = router;
