import mongoose from "mongoose";
import { EventSchemaType } from "../types/event-types.js";

const EventSchema = new mongoose.Schema<EventSchemaType>(
  {
    eventSlug: { type: String, unique: true, required: true },
    eventName: { type: String, required: true },

    eventImgUrl: { type: String, required: true },
    eventImgId: { type: String, required: true },

    eventFaviconUrl: { type: String, required: true },
    eventFaviconId: { type: String, required: true },

    eventDescription: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventDate: { type: String, required: true },
    participantCount: { type: Number, required: true },
    segmentCount: { type: Number, required: true },
    isUpcoming: { type: Boolean, required: true },

    dataUrl: { type: String, required: true },
    dataPublicId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Event", EventSchema);
