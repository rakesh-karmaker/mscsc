import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventCA from "../models/event-ca.model.js";
import EventRegistration from "../models/event-registration.model.js";
import { caApplicationSchema } from "../schemas/ca-application.schema.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { sendEmail } from "../../../shared/lib/mail-sender.js";
import {
  caApplicationConfirmationDraft,
  caApplicationRejectionDraft,
} from "../utils/ca-application-drafts.js";
import logger from "../../../shared/config/winston.js";
import mongoose from "mongoose";

// get all ca applications for an event
export async function getAllCAApplications(
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
    status?: string | string[];
    hasPreviousExperience?: string | string[];
    caCode?: string;
    sort?: Array<{ id?: string; desc?: string | boolean }> | string[];
  };

  try {
    // find the event by slug
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // parse and validate query parameters
    const page = params.page ? parseInt(params.page, 10) : 1;
    const perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePerPage =
      Number.isNaN(perPage) || perPage < 1 ? 10 : Math.min(perPage, 100);
    const skip = (safePage - 1) * safePerPage;

    const statuses = Array.isArray(params.status)
      ? params.status
      : params.status
        ? [params.status]
        : [];

    const experiences = Array.isArray(params.hasPreviousExperience)
      ? params.hasPreviousExperience
      : params.hasPreviousExperience
        ? [params.hasPreviousExperience]
        : [];

    const filterStage: Record<string, unknown> = {};
    if (typeof params.name === "string" && params.name.trim()) {
      filterStage.name = new RegExp(params.name.trim(), "i");
    }
    if (typeof params.caCode === "string" && params.caCode.trim()) {
      filterStage.caCode = new RegExp(params.caCode.trim(), "i");
    }
    if (statuses.length > 0) {
      filterStage.status = { $in: statuses };
    }
    if (experiences.includes("yes") && !experiences.includes("no")) {
      filterStage.hasPreviousExperience = true;
    }
    if (experiences.includes("no") && !experiences.includes("yes")) {
      filterStage.hasPreviousExperience = false;
    }

    const allowedSortFields = new Set([
      "name",
      "email",
      "applicationDate",
      "status",
      "caCode",
      "score",
      "position",
      "createdAt",
    ]);

    const rawSort = Array.isArray(params.sort) ? params.sort[0] : undefined;
    const sortField =
      rawSort && typeof rawSort === "object" && rawSort.id
        ? rawSort.id
        : "createdAt";
    const sortDesc =
      rawSort && typeof rawSort === "object"
        ? rawSort.desc === true || rawSort.desc === "true"
        : true;
    const safeSortField = allowedSortFields.has(sortField)
      ? sortField
      : "createdAt";
    const sortDirection: 1 | -1 = sortDesc ? -1 : 1;

    // 1) Rank all applications by score, 2) then filter, 3) then sort, 4) then paginate.
    const [aggregationResult] = await EventCA.aggregate([
      { $match: { eventId: event._id } },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: {
            position: { $documentNumber: {} },
          },
        },
      },
      ...(Object.keys(filterStage).length > 0 ? [{ $match: filterStage }] : []),
      { $sort: { [safeSortField]: sortDirection } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          facebookUrl: 1,
          photoUrl: 1,
          applicationDate: 1,
          hasPreviousExperience: 1,
          status: 1,
          caCode: 1,
          score: 1,
          position: 1,
        },
      },
      {
        $facet: {
          results: [{ $skip: skip }, { $limit: safePerPage }],
          count: [{ $count: "selectedCount" }],
        },
      },
    ]);

    const selectedCount = aggregationResult?.count?.[0]?.selectedCount || 0;
    const results = aggregationResult?.results || [];

    res.status(200).json({ results, selectedCount });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching CA applications", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
    });
  }
}

// get a specific CA application by ID
export async function getCAApplicationById(
  req: Request,
  res: Response,
): Promise<void> {
  const applicationId = req.params.applicationId;
  const eventSlug = req.params.eventSlug;
  if (!applicationId || !eventSlug) {
    res
      .status(400)
      .json({ message: "Application ID and Event Slug are required" });
    return;
  }

  try {
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // 1) score rank all applications for the event, 2) get the position of the current application, 3) return the application details along with the registrations that used their CA code
    const [aggregationResult] = await EventCA.aggregate([
      { $match: { eventId: event._id } },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: { position: { $documentNumber: {} } },
        },
      },
      { $match: { _id: new mongoose.Types.ObjectId(applicationId) } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          facebookUrl: 1,
          photoUrl: 1,
          address: 1,
          gender: 1,
          institution: 1,
          grade: 1,
          description: 1,
          hasPreviousExperience: 1,
          previousExperienceDetails: 1,
          applicationDate: 1,
          status: 1,
          caCode: 1,
          rejectionReason: 1,
          score: 1,
          position: 1,
        },
      },
    ]);
    if (!aggregationResult) {
      res.status(404).json({ message: "CA application not found" });
      return;
    }

    const registrationsUsingCACode = await EventRegistration.find({
      $and: [
        { reference: { $eq: aggregationResult.caCode } },
        {
          reference: { $ne: "N/A" },
        },
      ],
      eventId: event._id,
    })
      .lean()
      .select("_id name email status photoUrl");

    res.status(200).json({
      applicationDetails: aggregationResult,
      registrationsUsingCACode,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching CA application by ID", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      applicationId: req.params.applicationId,
    });
  }
}

// register a new CA application for an event
export async function applyForCA(req: Request, res: Response): Promise<void> {
  let publicId = ""; // This variable will hold the public ID of the uploaded image, so that we can delete it if any error occurs after the upload

  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      res.status(400).json({ message: "Event slug is required" });
      return;
    }

    // validate the form data using the schema
    const body = req.body;
    const file = req.file;

    const { error: validationError } = caApplicationSchema.validate(body);
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
    // find the event by slug
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // check if CA application is hidden or the CA application deadline has passed
    const hasDeadlinePassed =
      new Date() > new Date(event.caApplicationDeadline);
    if (event.hideCAForm || hasDeadlinePassed) {
      res.status(403).json({
        message: "CA application is closed for this event",
      });
      return;
    }

    // check if the applicant has already applied for CA for the event
    const existingApplication = await EventCA.findOne({
      eventId: event._id,
      email: body.email,
      status: { $in: ["pending", "approved"] },
    });
    if (existingApplication) {
      res.status(400).json({
        message: "This email has already applied for CA for this event",
      });
      return;
    }

    // upload the photo and get the URL
    const { url, imgId } = await uploadImage(
      file,
      true,
      `events/${eventSlug}/ca-applications`,
    );

    publicId = imgId; // store the public ID of the uploaded image

    const caApplication = await EventCA.create({
      eventId: event._id,
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      facebookUrl: body.facebookUrl,
      photoUrl: url,
      photoPublicId: imgId,
      address: body.address,
      gender: body.gender,
      institution: body.institution,
      grade: body.grade,
      hasPreviousExperience: body.hasPreviousExperience === "yes",
      previousExperienceDetails: body.previousExperienceDetails || "",
      description: body.description,
      applicationDate: new Date().toISOString(),
    });

    res.status(201).json({
      message: "CA application submitted successfully",
    });
    // Log the event
    logger.log("New CA application submitted", {
      eventSlug,
      applicationId: caApplication._id,
    });
  } catch (error) {
    if (publicId) {
      // if an error occurs after the image has been uploaded, delete the uploaded image to prevent orphaned files
      deleteFile(publicId);
    }
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error applying for CA", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
    });
  }
}

// edit a CA application status for an event
export async function editCAApplicationStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const eventSlug = req.params.eventSlug;
    const applicationId = req.params.applicationId;
    const status = req.body.status;
    const caCode = req.body.caCode;

    if (
      !eventSlug ||
      !applicationId ||
      !status ||
      !["pending", "approved", "rejected"].includes(status) ||
      (status === "approved" && !caCode)
    ) {
      res.status(400).json({
        message: "Event slug, application ID, status, and CA code are required",
      });
      return;
    }

    // find the event by slug
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // find the CA application by ID and event
    const caApplication = await EventCA.findOne({
      _id: applicationId,
      eventId: event._id,
    });
    if (!caApplication) {
      res.status(404).json({ message: "CA application not found" });
      return;
    }

    if (status === "approved") {
      // check if the CA code is unique for the event
      const existingCAWithCode = await EventCA.findOne({
        eventId: event._id,
        caCode,
        status: "approved",
      });
      if (existingCAWithCode) {
        res.status(400).json({
          message: "CA code already exists for another approved application",
        });
        return;
      }
    }

    // send the CA application approval mail
    if (status === "approved") {
      await sendEmail(
        caApplication.email,
        `CA Application Approved for ${event.eventName}`,
        caApplicationConfirmationDraft({
          eventName: event.eventName,
          logoUrl: event.eventLogoUrl,
          name: caApplication.name,
          code: caCode.toString().toUpperCase(),
        }),
      );
    } else if (status === "rejected") {
      await sendEmail(
        caApplication.email,
        `CA Application Rejected for ${event.eventName}`,
        caApplicationRejectionDraft({
          eventName: event.eventName,
          logoUrl: event.eventLogoUrl,
          reason: req.body.rejectionReason || "N/A",
        }),
      );
    }

    caApplication.status = status;
    if (status === "rejected") {
      caApplication.rejectionReason = req.body.rejectionReason || "N/A";
      caApplication.caCode = "N/A";
    } else if (status === "approved") {
      caApplication.caCode = caCode.toString().toUpperCase();
    }
    await caApplication.save();

    res.status(200).json({ message: "CA application updated and email sent" });
    logger.log(`CA application changed to ${status}`, {
      eventSlug,
      applicationId,
      editor: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error validating CA application", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      editor: req.user?._id,
    });
  }
}

// edit a CA application for an event
export async function editCAApplication(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      res.status(400).json({ message: "Application ID is required" });
      return;
    }

    const caApplication = await EventCA.findById(applicationId);
    if (!caApplication) {
      res.status(404).json({ message: "CA application not found" });
      return;
    }

    const body = req.body;
    if (body.caCode && body.caCode !== caApplication.caCode) {
      await EventRegistration.updateMany(
        { reference: caApplication.caCode },
        { $set: { reference: body.caCode } },
      );
    }

    const newCaApplication = await EventCA.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status:
            body.status !== undefined ? body.status : caApplication.status,
          caCode:
            body.caCode !== undefined ? body.caCode : caApplication.caCode,
        },
      },
      { new: true },
    );

    res.status(200).json({
      message: "CA application updated successfully",
      caApplication: newCaApplication,
    });
    logger.log("CA application edited", {
      applicationId,
      editor: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error editing CA application", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      editor: req.user?._id,
    });
  }
}

// delete a CA application for an event
export async function deleteCAApplication(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      res.status(400).json({ message: "Application ID is required" });
      return;
    }

    const caApplication = await EventCA.findById(applicationId);
    if (!caApplication) {
      res.status(404).json({ message: "CA application not found" });
      return;
    }

    deleteFile(caApplication.photoPublicId);
    await EventCA.findByIdAndDelete(applicationId);

    res.status(200).json({ message: "CA application deleted successfully" });
    logger.log("CA application deleted", {
      applicationId,
      deletedBy: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error deleting CA application", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      deletedBy: req.user?._id,
    });
  }
}
