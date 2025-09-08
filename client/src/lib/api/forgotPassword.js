import { api } from "@/config/axios";

export async function forgotPasswordRequest(email) {
  return api.post("/reset-password/otp", email);
}

export async function verifyOtp(email, otp) {
  return api.post("/reset-password/verify", { email, otp });
}

export async function resetPassword(email, token, newPassword) {
  return api.post("/reset-password/reset", { email, token, newPassword });
}
