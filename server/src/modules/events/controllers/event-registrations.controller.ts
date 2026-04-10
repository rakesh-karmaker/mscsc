import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import EventCA from "../models/event-ca.model.js";
import { eventRegistrationSchema } from "../schemas/event-registration.schema.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { generateCode } from "../../../shared/utils/generate-code.js";
import { sendEmail } from "../../../shared/lib/mail-sender.js";
import {
  eventConfirmationDraft,
  eventRejectionDraft,
} from "../utils/registration-drafts.js";
import {
  createOrUpdateEventTeams,
  normalizeEmail,
  normalizeTeamSegmentsData,
  validateTeamSegmentsData,
} from "../utils/event-registration.helpers.js";
import { TeamSegmentData } from "../event.types.js";

// get all event registrations
export async function getAllEventRegistrations(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      res.status(400).json({ message: "Event slug is required" });
      return;
    }

    // find the event by slug
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // find the registrations for the event
    const registrations = await EventRegistration.find({
      eventId: event._id,
    }).lean();

    res.status(200).json({ registrations });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// get a specific registration by ID
export async function getRegistrationById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      res.status(400).json({ message: "Registration ID is required" });
      return;
    }

    const registration =
      await EventRegistration.findById(registrationId).lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    res.status(200).json({ registration });
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// register a new participant for an event
export async function registerForEvent(
  req: Request,
  res: Response,
): Promise<void> {
  let publicId = "";
  let registrationId = "";
  let eventId = "";
  let normalizedReference: string | undefined;

  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      res.status(400).json({ message: "Event slug is required" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const file = req.file;

    if (
      body &&
      body.teamSegmentsData &&
      typeof body.teamSegmentsData === "string"
    ) {
      try {
        body.teamSegmentsData = JSON.parse(body.teamSegmentsData);
      } catch (error) {
        res.status(400).json({ message: "Invalid teamSegmentsData format" });
        return;
      }
    }

    const { error: validationError } = eventRegistrationSchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    if (!file || !file.fieldname || file.size === 0) {
      res.status(400).send({
        subject: "photo",
        message: "Photo is required",
      });
      return;
    }

    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    eventId = event._id.toString();
    const hasDeadlinePassed = new Date() > new Date(event.registrationDeadline);
    if (event.hideRegistrationForm || hasDeadlinePassed) {
      res
        .status(403)
        .json({ message: "Registration is closed for this event" });
      return;
    }

    const cleanedBody = {
      ...body,
      email: normalizeEmail(body.email),
      reference: body.reference
        ? String(body.reference).toUpperCase().trim()
        : undefined,
      clubReference: body.clubReference
        ? String(body.clubReference).toUpperCase().trim()
        : undefined,
      teamSegmentsData: normalizeTeamSegmentsData(body.teamSegmentsData),
    } as {
      email: string;
      name: string;
      phoneNumber: string;
      facebookUrl: string;
      institution: string;
      grade: string;
      category: string;
      segments: string[];
      transactionMethod: string;
      transactionPhoneNumber: string;
      transactionId: string;
      reference?: string;
      clubReference?: string;
      teamSegmentsData?: Record<string, TeamSegmentData>;
    };

    normalizedReference = cleanedBody.reference;

    const existingRegistration = await EventRegistration.findOne({
      eventId: event._id,
      email: cleanedBody.email,
      status: { $in: ["pending", "validated"] },
    });
    if (existingRegistration) {
      res.status(400).json({
        message: "You have already registered for this event with this email",
      });
      return;
    }

    if (cleanedBody.teamSegmentsData) {
      const teamValidationError = await validateTeamSegmentsData(
        event._id,
        cleanedBody.email,
        cleanedBody.teamSegmentsData,
      );
      if (teamValidationError) {
        res.status(400).json({
          subject: `teamSegmentsData.${teamValidationError.segmentSlug}`,
          message: teamValidationError.message,
        });
        return;
      }
    }

    const { url, imgId } = await uploadImage(
      file,
      true,
      `events/${eventSlug}/registrations`,
    );
    if (imgId) {
      publicId = imgId;
    }

    if (cleanedBody.reference) {
      const caApplication = await EventCA.findOneAndUpdate(
        {
          caCode: cleanedBody.reference,
          eventId: event._id,
          status: "approved",
        },
        { $inc: { score: 1 } },
        { new: true },
      );
      if (!caApplication) {
        console.warn(
          `Invalid CA code provided: ${cleanedBody.name} - ${cleanedBody.reference}`,
        );
      }
    }

    let code = generateCode(6);
    while (await EventRegistration.exists({ eventId: event._id, code })) {
      code = generateCode(6);
    }

    const registration = await EventRegistration.create({
      eventId: event._id,
      name: cleanedBody.name,
      email: cleanedBody.email,
      phoneNumber: cleanedBody.phoneNumber,
      facebookUrl: cleanedBody.facebookUrl,
      photoUrl: url,
      photoPublicId: imgId,
      institution: cleanedBody.institution,
      grade: cleanedBody.grade,
      category: cleanedBody.category,
      segments: cleanedBody.segments,
      transactionMethod: cleanedBody.transactionMethod,
      transactionPhoneNumber: cleanedBody.transactionPhoneNumber,
      transactionId: cleanedBody.transactionId,
      reference: cleanedBody.reference || "N/A",
      clubReference: cleanedBody.clubReference || "N/A",
      registrationDate: new Date().toISOString(),
      code,
    });

    if (registration._id) {
      registrationId = registration._id.toString();
    }

    event.participantCount = (event.participantCount || 0) + 1;
    await event.save();

    if (cleanedBody.teamSegmentsData) {
      await createOrUpdateEventTeams(
        event._id,
        cleanedBody.email,
        cleanedBody.teamSegmentsData,
      );
    }

    console.log(
      `New registration for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    if (publicId) {
      deleteFile(publicId);
    }
    if (registrationId) {
      await EventRegistration.findByIdAndDelete(registrationId);
      await Event.findByIdAndUpdate(eventId, {
        $inc: { participantCount: -1 },
      });
    }

    if (normalizedReference) {
      await EventCA.findOneAndUpdate(
        {
          eventId,
          caCode: normalizedReference,
        },
        { $inc: { score: -1 } },
      );
    }

    console.error("Error registering for event:", error);
    res.status(500).json({
      message:
        "There was an error processing your request. Please try again later.",
    });
  }
}

// change the status of a registration (admin action)
export async function changeRegistrationStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const registrationId = req.params.registrationId;
    const eventSlug = req.params.eventSlug;
    const body = req.body;
    if (
      !registrationId ||
      !eventSlug ||
      !body.status ||
      !["pending", "validated", "rejected"].includes(body.status)
    ) {
      res.status(400).json({
        message: "Registration ID, event slug, and status are required",
      });
      return;
    }

    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    // send the registration mail
    if (body.status === "validated") {
      await sendEmail(
        registration.email,
        `Registration Confirmed for ${registration.name}`,
        eventConfirmationDraft({
          eventName: event.eventName,
          name: registration.name,
          code: registration.code,
          logoUrl: event.eventLogoUrl,
        }),
      );
    } else if (body.status === "rejected") {
      await sendEmail(
        registration.email,
        `Registration Rejected for ${registration.name}`,
        eventRejectionDraft({
          eventName: event.eventName,
          logoUrl: event.eventLogoUrl,
          reason: body.rejectionReason || "N/A",
        }),
      );
    }

    registration.status = body.status;
    if (body.status === "rejected") {
      registration.rejectionReason = body.rejectionReason || "N/A";
    }
    await registration.save();

    console.log(
      `${req.user?._id} - Registration status changed to ${registration.status} for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res
      .status(200)
      .json({ message: "Registration status changed and email sent" });
  } catch (error) {
    console.error("Error changing registration status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// edit a registration (admin action)
export async function editRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      res.status(400).json({ message: "Registration ID is required" });
      return;
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const body = req.body;
    const newRegistration = await EventRegistration.findByIdAndUpdate(
      registrationId,
      {
        $set: {
          status: body.status !== undefined ? body.status : registration.status,
          hasAttended:
            body.hasAttended !== undefined
              ? body.hasAttended
              : registration.hasAttended,
        },
      },
      { new: true },
    ); // added { new: true } to the updated document

    res
      .status(200)
      .json({ message: "Registration updated", registration: newRegistration });
  } catch (error) {
    console.error("Error editing registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// delete a registration (admin action)
export async function deleteRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      res.status(400).json({ message: "Registration ID is required" });
      return;
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const event = await Event.findById(registration.eventId);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    deleteFile(registration.photoPublicId);

    await registration.deleteOne();

    event.participantCount = Math.max((event.participantCount || 1) - 1, 0);
    await event.save();

    console.log(
      `${req.user?._id} - Registration deleted for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(200).json({ message: "Registration deleted" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
