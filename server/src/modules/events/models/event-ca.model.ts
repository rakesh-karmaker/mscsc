import mongoose from "mongoose";
import { EventCASchemaType } from "../event.types.js";

const EventCASchema = new mongoose.Schema<EventCASchemaType>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    facebookUrl: { type: String, required: true },
    photoUrl: { type: String, required: true },
    photoPublicId: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },

    institution: { type: String, required: true },
    grade: { type: String, required: true },

    havePreviousExperience: { type: Boolean, required: true },

    description: { type: String, required: true },

    applicationDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    caCode: { type: String, required: true, default: null },
    score: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("EventCA", EventCASchema);
