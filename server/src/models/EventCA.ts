import mongoose from "mongoose";
import { EventCASchemaType } from "../types/event-types.js";

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

    isValidated: { type: Boolean, required: true, default: false },
    caCode: { type: String, required: true, unique: true, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EventCA", EventCASchema);
