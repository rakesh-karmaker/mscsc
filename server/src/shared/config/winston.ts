import winston from "winston";
import MongoDBTransport from "../lib/mongodb-transport.js";

const { combine, timestamp, printf, errors, json } = winston.format;

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
    new MongoDBTransport({
      level: "info",
      format: combine(json()),
    }),
  ],
});

export default logger;
