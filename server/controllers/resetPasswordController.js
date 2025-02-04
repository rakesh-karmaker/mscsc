const ResetOtp = require("../models/ResetPasswordOtp");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const generateRandomToken = require("../utils/generateRandomToken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");

// Request new OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "Invalid request" });

    //delete old otp
    await ResetOtp.deleteOne({ email });

    //check if email exists
    const member = await Member.findOne({ email });
    if (!member) return res.status(404).send({ message: "Email not found" });

    //generate OTP
    const generatedOTP = await generateOTP();

    //send email
    await sendEmail(email, generatedOTP);

    //save otp
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);
    const newOTP = new ResetOtp({
      email,
      opt: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 minute
    });
    await newOTP.save();

    res.status(200).send({ message: "OTP sent", email });
  } catch (err) {
    console.log("Error sending OTP - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

//verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).send({ message: "Invalid request" });

    const matchedOtp = await ResetOtp.findOne({ email });
    if (!matchedOtp) return res.status(404).send({ message: "OTP not found" });

    //check if otp is expired
    const { expiresAt } = matchedOtp;
    if (Date.now() > expiresAt) {
      await ResetOtp.deleteOne({ email });
      return res.status(400).send({ message: "OTP expired" });
    }

    //check if otp is already used
    if (matchedOtp.token) {
      await ResetOtp.deleteOne({ email });
      return res.status(400).send({ message: "OTP already used" });
    }

    //check if otp is valid
    const isOTPMatch = await bcrypt.compare(otp, matchedOtp.opt);
    if (!isOTPMatch) return res.status(400).send({ message: "Invalid OTP" });

    //generate new token
    const token = generateRandomToken();
    await ResetOtp.findOneAndUpdate({ email }, { token });

    res.status(200).send({ message: "OTP verified", token });
  } catch (err) {
    console.log("Error verifying OTP - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, token } = req.body;
    if (!email || !newPassword || !token)
      return res.status(400).send({ message: "Invalid request" });

    //check if token is valid
    const otp = await ResetOtp.findOne({ email });
    if (!otp) return res.status(404).send({ message: "OTP not found" });

    //check if token is expired
    const { expiresAt } = otp;
    if (Date.now() > expiresAt) {
      await ResetOtp.deleteOne({ email });
      return res.status(400).send({ message: "Session expired" });
    }

    //check the token
    if (otp.token !== token) {
      await ResetOtp.deleteOne({ email });
      return res.status(400).send({ message: "Invalid token" });
    }

    //update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Member.findOneAndUpdate({ email }, { password: hashedPassword });

    //delete otp
    await ResetOtp.deleteOne({ email });

    res.status(200).send({ message: "Password reset successful" });
  } catch (err) {
    console.log("Error resetting password - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = { sendOTP, verifyOtp, resetPassword };
