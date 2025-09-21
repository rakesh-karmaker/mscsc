import mongoose from "mongoose";
import { ForgotPasswordOTPSchemaType } from "../types/forgotPasswordTypes.js";

const ForgotPasswordOTPSchema =
  new mongoose.Schema<ForgotPasswordOTPSchemaType>({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    token: { type: String, default: null },
    createdAt: { type: Date },
    expiresAt: { type: Date },
  });

export default mongoose.model("ForgotPasswordOTP", ForgotPasswordOTPSchema);
