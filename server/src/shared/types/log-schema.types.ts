import mongoose from "mongoose";

export interface LogSchemaType extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  level: "info" | "warning" | "error";
  message: string;
  timestamp: string;
  context: Record<string, string>;
  service: string;
  createdAt: string;
  updatedAt: string;
}
