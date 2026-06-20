export interface ForgotPasswordOTPSchemaType {
  email: string;
  otp: string;
  token: string | null;
  createdAt: Date;
  expiresAt: Date;
}
