import { Request, Response } from "express";
import Member from "../models/member.js";
import generateOTP from "../utils/generate-otp.js";
import sendEmail from "../lib/send-email.js";
import { compareHash, generateHash } from "../utils/hash.js";
import ForgotPasswordOTP from "../models/forgot-password-otp.js";
import generateId from "../utils/generate-id.js";

// Send OTP to the user's email
export async function sendOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    //check if email exists
    const member = await Member.findOne({ email });
    if (!member) {
      res.status(404).send({ message: "Email not found" });
      return;
    }

    //delete old stored otp
    await ForgotPasswordOTP.deleteOne({ email });

    //generate otp
    const generatedOTP = generateOTP();

    //send email
    await sendEmail(email, generatedOTP);

    //save otp to db
    const hashedOTP = await generateHash(generatedOTP);
    await ForgotPasswordOTP.create({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 minute
    });

    res.status(200).send({ message: "OTP sent", email });
  } catch (err) {
    console.log("Error sending OTP - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Verify the OTP entered by the user
export async function verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    //find otp in db
    const storedOtp = await ForgotPasswordOTP.findOne({ email });
    if (!storedOtp) {
      res.status(404).send({ message: "OTP not found" });
      return;
    }

    //check if otp is expired
    if (Date.now() > storedOtp.expiresAt.getTime()) {
      await ForgotPasswordOTP.deleteOne({ email });
      res.status(400).send({ message: "OTP expired" });
      return;
    }

    //check if otp is valid
    const isOTPMatch = await compareHash(otp, storedOtp.otp);
    if (!isOTPMatch) {
      res.status(400).send({ message: "Invalid OTP" });
      return;
    }

    //generate new token
    const token = generateId();
    await ForgotPasswordOTP.findOneAndUpdate({ email }, { token });

    res.status(200).send({ message: "OTP verified", token });
  } catch (err) {
    console.log("Error verifying OTP - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Reset the password using the verified OTP token
export async function resetPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, newPassword, token } = req.body;
    if (!email || !newPassword || !token) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    //find otp in db
    const storedOtp = await ForgotPasswordOTP.findOne({ email });
    if (!storedOtp) {
      res.status(404).send({ message: "OTP not found" });
      return;
    }

    //check if otp is expired
    if (Date.now() > storedOtp.expiresAt.getTime()) {
      await ForgotPasswordOTP.deleteOne({ email });
      res.status(400).send({ message: "Session expired" });
      return;
    }

    //check the token
    if (storedOtp.token !== token) {
      await ForgotPasswordOTP.deleteOne({ email });
      res.status(400).send({ message: "Invalid token" });
      return;
    }

    //update password
    const hashedPassword = await generateHash(newPassword);
    await Member.findOneAndUpdate({ email }, { password: hashedPassword });

    //delete stored otp
    await ForgotPasswordOTP.deleteOne({ email });

    res.status(200).send({ message: "Password reset successful" });
  } catch (err) {
    console.log("Error resetting password - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
