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

    teamName: { type: String, required: true },
    leaderEmail: {
      type: String,
      required: true,
    },
    memberEmails: { type: [String] },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("EventTeam", EventTeamSchema);
