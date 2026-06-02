import mongoose from "mongoose";
import { EventTeamSchemaType } from "../event.types.js";

const EventTeamSchema = new mongoose.Schema<EventTeamSchemaType>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    segmentSlug: { type: String, required: true },

    isPaidSegment: { type: Boolean, required: true, default: false },
    transactionMethod: { type: String, default: "" },
    transactionPhoneNumber: { type: String, default: "" },
    transactionId: { type: String, default: "" },

    teamName: { type: String, required: true },
    leaderEmail: {
      type: String,
      required: true,
    },
    memberEmails: { type: [String] },

    /*
     * status: pending, approved, rejected
     * pending: team registration is complete and pending review
     * approved: team registration is approved
     * rejected: team registration is rejected, with a reason provided in rejectionReason
     */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<EventTeamSchemaType>(
  "EventTeam",
  EventTeamSchema,
);
