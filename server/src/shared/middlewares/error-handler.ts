import { Request, Response, NextFunction } from "express";
import logger from "../config/winston.js";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
  logger.error("Error Handler Middleware:", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
};
