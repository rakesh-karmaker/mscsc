import config from "../config/config.js";
import jwt from "jsonwebtoken";

const MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 1 month

export function signJWTToken(
  payload: Record<string, string>,
  expiresIn: number = MAX_AGE
) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

export function verifyJWTToken(token: string) {
  return jwt.verify(token, config.jwtSecret);
}
