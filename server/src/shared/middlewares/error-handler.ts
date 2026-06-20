import { Request, Response, NextFunction } from "express";
import getDate from "../utils/get-date.js";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Server Error - ", getDate(), "\n---\n", err, "\n---\n");
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
};
