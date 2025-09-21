import { api } from "@/config/axios";

export async function forgotPasswordRequest(email) {
  return api.post("/forgot-password/otp", email);
}

export async function verifyOtp(email, otp) {
  return api.post("/forgot-password/verify", { email, otp });
}

export async function resetPassword(email, token, newPassword) {
  return api.post("/forgot-password/reset", { email, token, newPassword });
}
