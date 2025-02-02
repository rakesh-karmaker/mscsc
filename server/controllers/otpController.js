const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const ResetOtp = require("../models/ResetOtp");

// Request new OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Invalid request" });

    //delete old otp
    await ResetOtp.deleteOne({ email });

    //generate OTP
    const otp = await generateOTP();
    console.log(otp, "otp");

    //send email

    await sendEmail(email);

    //save otp
    const newOTP = new ResetOtp({
      email,
      opt: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    await newOTP.save();

    res.status(200).send({ newOTP });
    // res.send({ otp });
  } catch (err) {
    console.log("Error sending OTP - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = { sendOTP };
