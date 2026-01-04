import express from "express";
import {
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/forgot-password-controller.js";

const forgotPasswordRouter = express.Router();

// Forgot Password Routes
forgotPasswordRouter.post("/otp", sendOTP);
forgotPasswordRouter.post("/verify", verifyOTP);
forgotPasswordRouter.post("/reset", resetPassword);

export default forgotPasswordRouter;
