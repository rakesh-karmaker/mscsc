import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getDate from "../utils/getDate.js";
import Member from "../models/Member.js";
import config from "../config/config.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

// Verify if user is authorized
export async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
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
        "\n---\n"
      );
    } else {
      console.log("Authorization error - ", getDate(), "\n---\n");
    }
    res.status(400).send({ message: "Invalid Token" });
  }
}

// Verify if user is admin
export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Fetch member from DB
  const member = await Member.findById(req.user?._id ?? "").select("role");
  if (!member) {
    res.status(404).send({ message: "Member not found" });
    return;
  }

  // Check if member is admin
  if (!member.role || member.role !== "admin") {
    res.status(401).send({ message: "Access Denied" });
    return;
  }
  next();
}
