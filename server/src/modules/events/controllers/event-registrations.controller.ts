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
import { normalizeEmail } from "../utils/event-registration.helpers.js";
import getGradeRange from "../utils/get-grade-range.js";
import EventTeam from "../models/event-team.model.js";
import ClubPartner from "../models/club-partner.model.js";
import logger from "../../../shared/config/winston.js";
import { generateSlugFromTitle } from "../../../shared/utils/generate-slug.js";
import jwt from "jsonwebtoken";
import config from "../../../shared/config/config.js";
import { generateHash } from "../../../shared/utils/hash.js";

const JWT_EXPIRATION = "1yr"; // Token valid for 1 year

// get all event registrations
export async function getAllEventRegistrations(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  if (!eventSlug) {
    res.status(400).json({ message: "Event slug is required" });
    return;
  }

  const params = req.query as {
    page?: string;
    perPage?: string;
    name?: string;
    status?: string[];
    category?: string[];
    segments?: string[];
    code?: string;
    transactionMethod?: string[];
    sort?: string[];
  };

  try {
    // find the event by slug
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // parse and validate query parameters
    const page = params.page ? parseInt(params.page) : 1;
    const perPage = params.perPage ? parseInt(params.perPage) : 10;
    const skip = (page - 1) * perPage;
    const statusFilter =
      params.status && params.status.length > 0
        ? { status: { $in: params.status } }
        : {};
    const segmentsFilter =
      params.segments && params.segments.length > 0
        ? { segments: { $in: params.segments } }
        : {};
    const transactionMethodFilter =
      params.transactionMethod && params.transactionMethod.length > 0
        ? { transactionMethod: { $in: params.transactionMethod } }
        : {};
    const categoryFilter =
      params.category && params.category.length > 0
        ? getGradeRange(params.category)
        : {};
    const sort: { id: string; desc: boolean } | {} =
      Array.isArray(params.sort) && params.sort.length > 0
        ? params.sort[0]
        : {};

    const regex: { [key: string]: RegExp | undefined } = {
      name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
      code: new RegExp(typeof params.code === "string" ? params.code : "", "i"),
    };

    // find the registrations for the event
    const registrations = await EventRegistration.find({
      eventId: event._id,
      ...regex,
      ...statusFilter,
      ...segmentsFilter,
      ...transactionMethodFilter,
      ...categoryFilter,
    })
      .sort(
        sort && Object.keys(sort).length > 0 && "id" in sort && "desc" in sort
          ? { [String(sort.id)]: sort.desc === "true" ? -1 : 1 }
          : { createdAt: -1 },
      )
      .select(
        "_id name photoUrl email phoneNumber status hasAttended grade code transactionMethod registrationDate segments",
      );

    const totalCount = registrations.length;
    const paginatedRegistrations = registrations.slice(skip, skip + perPage);

    res
      .status(200)
      .json({ results: paginatedRegistrations, selectedCount: totalCount });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching event registrations", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
    });
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

    const registration = await EventRegistration.findById(registrationId)
      .lean()
      .select(
        "_id eventId name email phoneNumber facebookUrl photoUrl institution grade segments transactionMethod transactionPhoneNumber transactionId registrationDate status rejectionReason code reference clubReference",
      );
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    let caData = null;
    if (registration.reference && registration.reference !== "N/A") {
      caData = await EventCA.findOne({
        eventId: registration.eventId,
        caCode: registration.reference,
      })
        .lean()
        .select("_id name status photoUrl caCode");
    }

    // get the team data with the memberEmails name and registration details (eg: name, registrationId, status) for each member email
    const teamData = await EventTeam.find({
      eventId: registration.eventId,
      $or: [
        { leaderEmail: registration.email },
        { memberEmails: { $in: [registration.email] } },
      ],
    }).select("_id segmentSlug teamName leaderEmail memberEmails status");

    res
      .status(200)
      .json({ registrationDetails: registration, teamData, caData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching registration by ID", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      registrationId: req.params.registrationId,
    });
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
  let reference = "";

  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      res.status(400).json({ message: "Event slug is required" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const file = req.file;

    // if (
    //   body &&
    //   body.teamSegmentsData &&
    //   typeof body.teamSegmentsData === "string"
    // ) {
    //   try {
    //     body.teamSegmentsData = JSON.parse(body.teamSegmentsData);
    //   } catch (error) {
    //     res.status(400).json({ message: "Invalid teamSegmentsData format" });
    //     return;
    //   }
    // }

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

      logger.log("New registration attempt after deadline", {
        eventSlug,
        email: body.email ? String(body.email).toLowerCase() : "N/A",
        name: body.name ? String(body.name) : "N/A",
      });
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
      // teamSegmentsData: normalizeTeamSegmentsData(body.teamSegmentsData),
    } as {
      email: string;
      password: string;
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
    };

    reference = cleanedBody.reference || "";

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

    // if (cleanedBody.teamSegmentsData) {
    //   const teamValidationError = await validateTeamSegmentsData(
    //     event._id,
    //     cleanedBody.email,
    //     cleanedBody.teamSegmentsData,
    //   );
    //   if (teamValidationError) {
    //     res.status(400).json({
    //       subject: `teamSegmentsData.${teamValidationError.segmentSlug}`,
    //       message: teamValidationError.message,
    //     });
    //     return;
    //   }
    // }

    const { url, imgId } = await uploadImage(
      file,
      true,
      `events/${eventSlug}/registrations`,
    );
    if (imgId) {
      publicId = imgId;
    }

    // hash the password
    const hashedPassword = await generateHash(cleanedBody.password);

    let code = generateCode(6);
    while (await EventRegistration.exists({ eventId: event._id, code })) {
      code = generateCode(6);
    }

    const registration = await EventRegistration.create({
      eventId: event._id,
      name: cleanedBody.name.trim(),
      email: cleanedBody.email.trim().toLowerCase(),
      password: hashedPassword,
      phoneNumber: cleanedBody.phoneNumber.trim(),
      facebookUrl: cleanedBody.facebookUrl.trim(),
      photoUrl: url,
      photoPublicId: imgId,
      institution: cleanedBody.institution.trim(),
      grade: cleanedBody.grade.trim(),
      category: cleanedBody.category.trim(),
      segments: cleanedBody.segments.map((segment) =>
        generateSlugFromTitle(segment, false),
      ),
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

    await Event.findByIdAndUpdate(event._id, {
      $inc: { participantCount: 1 },
    });

    // generate JWT token
    const token = jwt.sign({ _id: registration._id }, config.jwtSecret, {
      expiresIn: JWT_EXPIRATION,
    });

    // get the team data
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

    res.status(201).json({
      message: "Registration successful",
      token,
      registrationData: {
        _id: registration._id,
        name: registration.name,
        email: registration.email,
        photoUrl: registration.photoUrl,
        paidSoloSegments: registration.paidSoloSegments,
        teamSegmentsData,
        status: registration.status,
      },
    });
    logger.info(
      "info",
      `New registration for event ${event.eventName}: ${registration.name} (${registration.email})`,
      {
        eventSlug,
        email: cleanedBody.email,
        name: cleanedBody.name,
      },
    );
  } catch (error) {
    console.log(error);
    if (publicId) {
      deleteFile(publicId);
    }
    if (registrationId) {
      await EventRegistration.findByIdAndDelete(registrationId);
      await Event.findByIdAndUpdate(eventId, {
        $inc: { participantCount: -1 },
      });
    }

    if (reference && reference !== "N/A") {
      await EventCA.findOneAndUpdate(
        {
          eventId,
          caCode: reference,
        },
        { $inc: { score: -1 } },
      );
    }

    res.status(500).json({
      message:
        "There was an error processing your request. Please try again later.",
    });
    logger.error("Error processing event registration", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
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
      if (registration.reference && registration.reference !== "N/A") {
        const caApplication = await EventCA.findOneAndUpdate(
          {
            caCode: registration.reference,
            eventId: event._id,
            status: "approved",
          },
          { $inc: { score: 1 } },
          { new: true },
        );
        if (!caApplication) {
          logger.warn("Invalid CA code provided during registration", {
            eventSlug,
            email: registration.email,
            name: registration.name,
            reference: registration.reference,
          });
        }
      }

      if (registration.clubReference && registration.clubReference !== "N/A") {
        const clubPartner = await ClubPartner.findOneAndUpdate(
          {
            code: registration.clubReference,
            eventId: event._id,
            status: "active",
          },
          { $inc: { score: 1 } },
          { new: true },
        );
        if (!clubPartner) {
          logger.warn("Invalid club code provided during registration", {
            eventSlug,
            email: registration.email,
            name: registration.name,
            clubReference: registration.clubReference,
          });
        }
      }

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
      // if the registration was previously validated and had a reference code, decrement the score of the corresponding CA
      if (
        registration.status === "validated" &&
        registration.reference &&
        registration.reference !== "N/A"
      ) {
        await EventCA.findOneAndUpdate(
          {
            caCode: registration.reference,
            eventId: event._id,
            status: "approved",
          },
          { $inc: { score: -1 } },
        );
      }
      // if the registration was previously validated and had a club reference, decrement the score of the corresponding club partner
      if (
        registration.status === "validated" &&
        registration.clubReference &&
        registration.clubReference !== "N/A"
      ) {
        await ClubPartner.findOneAndUpdate(
          {
            code: registration.clubReference,
            eventId: event._id,
            status: "active",
          },
          { $inc: { score: -1 } },
        );
      }
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

    res
      .status(200)
      .json({ message: "Registration status changed and email sent" });
    logger.warn(
      `Registration status changed to ${registration.status} for ${registration.name} (${registration.email})`,
      {
        eventSlug,
        registrationId,
        editor: req.user?._id,
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error changing registration status", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      registrationId: req.params.registrationId,
      editor: req.user?._id,
    });
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
    logger.warn(
      `Registration edited for ${newRegistration?.name} (${newRegistration?.email})`,
      {
        eventSlug: req.params.eventSlug,
        registrationId,
        editor: req.user?._id,
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error editing registration", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      registrationId: req.params.registrationId,
      editor: req.user?._id,
    });
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

    res.status(200).json({ message: "Registration deleted" });
    logger.warn(
      `Registration deleted for event ${event.eventName}: ${registration.name} (${registration.email})`,
      {
        eventSlug: req.params.eventSlug,
        registrationId: req.params.registrationId,
        deletedBy: req.user?._id,
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error deleting registration", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      registrationId: req.params.registrationId,
      deletedBy: req.user?._id,
    });
  }
}
