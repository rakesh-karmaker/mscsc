import mongoose from "mongoose";
import { ClubPartnerSchemaType } from "../event.types.js";

const ClubPartnerSchema = new mongoose.Schema<ClubPartnerSchemaType>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    clubName: { type: String, required: true },
    clubLogoUrl: { type: String },
    clubLogoPublicId: { type: String },

    clubEmail: { type: String },
    phoneNumber: { type: String },
    facebookUrl: { type: String },

    institution: { type: String },
    address: { type: String },

    moderatorName: { type: String },
    moderatorEmail: { type: String },
    moderatorPhoneNumber: { type: String },

    score: { type: Number, default: 0 },
    code: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ClubPartnerSchemaType>(
  "ClubPartner",
  ClubPartnerSchema,
);
