const express = require("express");
const { register, login } = require("../controllers/authController");
const upload = require("../middleware/multer");

const router = express.Router();

// Auth Routes
router.post("/register", upload.single("image"), register);
router.post("/login", login);

module.exports = router;
