import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import { normalizeEmail } from "../utils/event-registration.helpers.js";
import EventTeam from "../models/event-team.model.js";
import logger from "../../../shared/config/winston.js";
import jwt from "jsonwebtoken";
import config from "../../../shared/config/config.js";
import { compareHash } from "../../../shared/utils/hash.js";

const JWT_EXPIRATION = "1yr"; // Token valid for 1 year

// login participant and return registration data
export async function loginParticipant(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  if (!eventSlug) {
    res.status(400).json({ message: "Event slug is required" });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const event = await Event.findOne({ eventSlug }).select("_id").lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const registration = await EventRegistration.findOne({
      eventId: event._id,
      email: normalizeEmail(email),
    })
      .select(
        "_id name email password photoUrl paidSoloSegments status segments",
      )
      .lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const isMatch = await compareHash(password, registration.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ _id: registration._id }, config.jwtSecret, {
      expiresIn: JWT_EXPIRATION,
    });

    const teamSegmentsData = await EventTeam.find({
      eventId: event._id,
      $or: [
        { leaderEmail: registration.email },
        { memberEmails: { $in: [registration.email] } },
      ],
    })
      .select(
        "segmentSlug isPaidSegment transactionMethod teamName leaderEmail memberEmails status rejectionReason",
      )
      .lean();

    res.status(200).json({
      message: "Login successful",
      token,
      userData: {
        _id: registration._id,
        name: registration.name,
        email: registration.email,
        photoUrl: registration.photoUrl,
        paidSoloSegments: registration.paidSoloSegments,
        teamSegmentsData,
        status: registration.status,
        segments: registration.segments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in participant" });
    logger.error("Error logging in participant", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      registrationId: req.params.registrationId,
    });
  }
}

// get full registration data for a participant (for profile page)
export async function getRegistrationData(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  const id = req.user?._id;
  if (!eventSlug || !id) {
    res.status(400).json({ message: "Event slug and user ID are required" });
    return;
  }

  try {
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const registration = await EventRegistration.findOne({
      eventId: event._id,
      _id: id,
    })
      .select(
        "_id name email phoneNumber facebookUrl photoUrl institution grade segments paidSoloSegments registrationDate status rejectionReason code hasAttended",
      )
      .lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const teamSegmentsData = await EventTeam.find({
      eventId: event._id,
      $or: [
        { leaderEmail: registration.email },
        { memberEmails: { $in: [registration.email] } },
      ],
      status: { $ne: "rejected" }, // exclude rejected teams
    })
      .select(
        "segmentSlug isPaidSegment transactionMethod teamName leaderEmail memberEmails status rejectionReason",
      )
      .lean();

    res.status(200).json({
      userData: {
        ...registration,
        teamSegmentsData,
      },
      bannerUrl: event.eventBannerUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching registration data" });
    logger.error("Error fetching registration data", { error });
  }
}
