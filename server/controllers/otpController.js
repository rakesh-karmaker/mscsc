const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");

// Request new OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Invalid request" });

    //delete old otp
    await OTP.deleteOne({ email });

    //generate OTP
    const otp = await generateOTP();
  } catch (err) {
    console.log("Error sending OTP - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = { sendOTP };
