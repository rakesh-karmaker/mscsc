const express = require("express");
const {
  sendOTP,
  verifyOtp,
  resetPassword,
} = require("../controllers/resetPasswordController");

const router = express.Router();

router.post("/otp", sendOTP);
router.post("/verify", verifyOtp);
router.post("/reset", resetPassword);

module.exports = router;
