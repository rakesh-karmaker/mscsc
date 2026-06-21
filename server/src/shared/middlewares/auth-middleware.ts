import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getDate from "../utils/get-date.js";
import Member from "../models/member.model.js";
import config from "../config/config.js";
import { Role, ROLE_WEIGHTS } from "../utils/roles.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role?: Role;
      };
      requestDetails?: {
        includeRegistrations?: boolean;
      };
    }
  }
}

// Verify if user is authorized
export async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Check for token
    const prefix = "Bearer ";
    const token = req.header("Authorization")?.split(prefix)[1];
    if (!token) {
      res.status(401).send({ message: "Access Denied" });
      return;
    }

    // Verify token
    const verified = jwt.verify(token, config.jwtSecret) as { _id: string };
    if (!verified) {
      res.status(401).send({ message: "Access Denied" });
      return;
    }
    req.user = verified;

    next();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage === "jwt expired") {
      console.log(
        "Authorization error - Token Expired - ",
        getDate(),
        "\n---\n",
      );
    } else {
      console.log("Authorization error - ", getDate(), "\n---\n");
    }
    res.status(400).send({ message: "Invalid Token" });
  }
}

export function requireMinimumRole(minimumRequiredRole: Role) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 1. Ensure user is authenticated first
      if (!req.user?._id) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      // 2. Fetch current member role from DB (Keeps it secure and real-time)
      const member = await Member.findById(req.user._id).select("role");
      if (!member || !member.role) {
        res.status(404).send({ message: "Member role not found" });
        return;
      }

      const userRole = member.role as Role;
      req.user.role = userRole;

      // 3. Compare hierarchy weights
      const userWeight = ROLE_WEIGHTS[userRole] || 0;
      const requiredWeight = ROLE_WEIGHTS[minimumRequiredRole];

      if (userWeight < requiredWeight) {
        res
          .status(403)
          .send({ message: "Access Denied: Insufficient Permissions" });
        return;
      }

      next();
    } catch (error) {
      console.error("Role verification error:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
}
