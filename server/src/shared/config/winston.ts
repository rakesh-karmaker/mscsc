import mongoose from "mongoose";
import winston from "winston";
import "winston-mongodb";

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack ? `\nStack trace: ${stack}\n` : ""}`;
});

const logger = winston.createLogger({
  level: "http",
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.MongoDB({
      db: mongoose.connection.useDb("test") as any,
      collection: "logs",
      level: "logs",
    }),
  ],
});

export default logger;
