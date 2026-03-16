import mongoose from "mongoose";
import { MessageSchemaType } from "./message.types.js";

const MessageSchema = new mongoose.Schema<MessageSchemaType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, default: "Main Website" },
    new: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Message", MessageSchema);
