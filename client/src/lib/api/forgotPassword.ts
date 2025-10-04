import { api } from "@/config/axios";

export async function forgotPasswordRequest(email: string) {
  return api.post("/forgot-password/otp", { email });
}

export async function verifyOtp(email: string, otp: string) {
  return api.post("/forgot-password/verify", { email, otp });
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  return api.post("/forgot-password/reset", { email, token, newPassword });
}
