import mongoose from "mongoose";
import { EventRegistrationSchemaType } from "../types/event-types.js";

const EventRegistrationSchema =
  new mongoose.Schema<EventRegistrationSchemaType>(
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

      institution: { type: String, required: true },
      grade: { type: String, required: true },
      segments: { type: [String], required: true },

      transactionMethod: { type: String, required: true },
      transactionPhoneNumber: { type: String, required: true },
      transactionId: { type: String, required: true },

      reference: { type: String, required: true },

      registrationDate: { type: String, required: true },
      isVerified: { type: Boolean, required: true, default: false },
      hasAttended: { type: Boolean, required: true, default: false },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model("EventRegistration", EventRegistrationSchema);
