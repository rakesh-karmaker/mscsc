const express = require("express");
const {
  sendOTP,
  verifyOtp,
  resetPassword,
} = require("../controllers/resetPassword");

const router = express.Router();

router.post("/", sendOTP);
router.post("/verify", verifyOtp);
router.post("/reset", resetPassword);

module.exports = router;
