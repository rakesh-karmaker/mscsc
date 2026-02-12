import mongoose from "mongoose";
import { EventSchemaType } from "../types/event-types.js";

const EventSchema = new mongoose.Schema<EventSchemaType>(
  {
    eventSlug: { type: String, unique: true, required: true },
    eventName: { type: String, required: true },

    eventLogoUrl: { type: String, required: true },
    eventLogoPublicId: { type: String, required: true },

    eventFaviconUrl: { type: String, required: true },
    eventFaviconPublicId: { type: String, required: true },

    eventDescription: { type: String, required: true },
    eventLocation: { type: String, required: true },
    eventDate: { type: String, required: true },
    participantCount: { type: Number, required: true },
    segmentCount: { type: Number, required: true },

    isUpcoming: { type: Boolean, required: true },
    isHidden: { type: Boolean, required: true, default: false },

    dataUrl: { type: String, required: true },
    dataPublicId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Event", EventSchema);
