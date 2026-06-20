import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import logger from "../../../shared/config/winston.js";
import { sendEmail } from "../../../shared/lib/mail-sender.js";
import {
  segmentConfirmationDraft,
  segmentRejectionDraft,
} from "../utils/drafts/segment-drafts.js";
import { deSlugify } from "../utils/de-slugify.js";

export async function addFreeSoloSegment(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  const registrationId = req.user?._id;
  const { segmentSlug } = req.body;

  console.log("Adding free solo segment", {
    eventSlug,
    registrationId,
    segmentSlug,
  });

  if (!eventSlug || !registrationId || !segmentSlug) {
    res.status(400).json({
      message: "Event slug, registration ID, and segment slug are required",
    });
    return;
  }

  try {
    const event = await Event.findOne({
      eventSlug: eventSlug,
    })
      .select("_id segments")
      .lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!event.segments.map((s) => s.segmentSlug).includes(segmentSlug)) {
      res.status(400).json({ message: "Segment not found in event" });
      return;
    }

    const registration = await EventRegistration.findOne({
      eventId: event._id,
      _id: registrationId,
    }).lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    if (registration.segments.includes(segmentSlug)) {
      res
        .status(400)
        .json({ message: "Segment already added to registration" });
      return;
    }

    registration.segments.push(segmentSlug);

    await EventRegistration.updateOne(
      { _id: registrationId },
      { segments: registration.segments },
    );

    res.status(200).json({
      segments: registration.segments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding free solo segment" });
    logger.error("Error adding free solo segment", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      registrationId,
    });
  }
}

export async function addPaidSoloSegment(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  const registrationId = req.user?._id;
  const {
    segmentSlug,
    transactionMethod,
    transactionPhoneNumber,
    transactionId,
    registrationDate,
  } = req.body;

  if (
    !eventSlug ||
    !registrationId ||
    !segmentSlug ||
    !transactionMethod ||
    !transactionPhoneNumber ||
    !transactionId ||
    !registrationDate
  ) {
    res.status(400).json({
      message:
        "Event slug, registration ID, segment slug, transaction method, transaction number, transaction ID, and registration date are required",
    });
    return;
  }

  try {
    const event = await Event.findOne({ eventSlug })
      .select("_id segments")
      .lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!event.segments.map((s) => s.segmentSlug).includes(segmentSlug)) {
      res.status(400).json({ message: "Segment not found in event" });
      return;
    }

    const registration = await EventRegistration.findOne({
      eventId: event._id,
      _id: registrationId,
    }).lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const index = registration.paidSoloSegments.findIndex(
      (s) => s.segmentSlug === segmentSlug && s.status !== "rejected",
    );
    if (index !== -1) {
      res
        .status(400)
        .json({ message: "Segment already added to paid solo segments" });
      return;
    }

    registration.paidSoloSegments.push({
      segmentSlug,
      fees:
        event.segments.find((s) => s.segmentSlug === segmentSlug)?.fees || 0,
      transactionMethod,
      transactionPhoneNumber: transactionPhoneNumber,
      transactionId,
      status: "pending",
      rejectionReason: "",
      registrationDate,
    });
    registration.segments.push(segmentSlug);

    await EventRegistration.updateOne(
      { _id: registrationId },
      {
        paidSoloSegments: registration.paidSoloSegments,
        segments: registration.segments,
      },
    );

    res.status(200).json({
      paidSoloSegments: registration.paidSoloSegments,
      segments: registration.segments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding paid solo segment" });
    logger.error("Error adding paid solo segment", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      registrationId,
    });
  }
}

export async function changePaidSoloSegmentStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug, registrationId, segmentSlug } = req.params;
  const { status, rejectionReason } = req.body;

  if (!eventSlug || !registrationId || !segmentSlug || !status) {
    res.status(400).json({
      message:
        "Event slug, registration ID, segment slug, and status are required",
    });
    return;
  }

  if (!["pending", "validated", "rejected"].includes(status)) {
    res.status(400).json({ message: "Invalid status value" });
    return;
  }

  try {
    const event = await Event.findOne({ eventSlug })
      .select("_id segments eventName eventLogoUrl")
      .lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const registration = await EventRegistration.findOne({
      eventId: event._id,
      _id: registrationId,
    }).lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const segmentIndex = registration.paidSoloSegments.findIndex(
      (s) => s.segmentSlug === segmentSlug && s.status !== "rejected",
    );
    if (segmentIndex === -1) {
      res
        .status(404)
        .json({ message: "Paid solo segment not found in registration" });
      return;
    }

    registration.paidSoloSegments[segmentIndex].status = status;

    let emailSentError = false;
    if (status === "validated") {
      const emailSent = await sendEmail(
        registration.email,
        `Your solo segment application for ${deSlugify(segmentSlug as string, false)} has been approved!`,
        segmentConfirmationDraft({
          segmentName: deSlugify(segmentSlug as string, false),
          name: registration.name,
          logoUrl: event.eventLogoUrl,
        }),
      );

      if (!emailSent) emailSentError = true;
    } else if (status === "rejected") {
      registration.paidSoloSegments[segmentIndex].rejectionReason =
        rejectionReason || "No reason provided";

      const emailSent = await sendEmail(
        registration.email,
        `Your solo segment application for ${deSlugify(segmentSlug as string, false)} has been rejected`,
        segmentRejectionDraft({
          segmentName: deSlugify(segmentSlug as string, false),
          logoUrl: event.eventLogoUrl,
          reason: rejectionReason || "No reason provided",
        }),
      );

      // remove the segment from the registration
      const index = registration?.segments.indexOf(segmentSlug as string);
      if (index !== undefined && index > -1) {
        registration?.segments.splice(index, 1);
      }

      if (!emailSent) emailSentError = true;
    }

    await EventRegistration.updateOne(
      { _id: registrationId },
      {
        paidSoloSegments: registration.paidSoloSegments,
        segments: registration.segments,
      },
    );

    res.status(200).json({
      message: "Paid solo segment status updated successfully",
      emailSentError: emailSentError,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing paid solo segment status" });
    logger.error("Error changing paid solo segment status", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      registrationId,
    });
  }
}
