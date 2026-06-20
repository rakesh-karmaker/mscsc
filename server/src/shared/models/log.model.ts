import mongoose from "mongoose";
import { LogSchemaType } from "../types/log-schema.types.js";

const LogSchema = new mongoose.Schema<LogSchemaType>(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      required: true,
    },
    message: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() }, // ISO 8601
    context: { type: Object, default: {} },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  },
);

export default mongoose.model<LogSchemaType>("Log", LogSchema);
