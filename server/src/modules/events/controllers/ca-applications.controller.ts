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
    status?: string[];
    hasPreviousExperience?: string | string[];
    caCode?: string;
    sort?: string[];
  };

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

    // parse and validate query parameters
    const page = params.page ? parseInt(params.page) : 1;
    const perPage = params.perPage ? parseInt(params.perPage) : 10;
    const skip = (page - 1) * perPage;
    const statusFilter =
      params.status && params.status.length > 0
        ? { status: { $in: params.status } }
        : {};
    const experienceFilter =
      params.hasPreviousExperience === "yes" ||
      params.hasPreviousExperience?.includes("yes")
        ? { hasPreviousExperience: true }
        : params.hasPreviousExperience === "no" ||
            params.hasPreviousExperience?.includes("no")
          ? { hasPreviousExperience: false }
          : {};
    const sort: { id: string; desc: boolean } | {} =
      Array.isArray(params.sort) && params.sort.length > 0
        ? params.sort[0]
        : {};

    const regex: { [key: string]: RegExp | undefined } = {
      name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
      caCode: new RegExp(
        typeof params.caCode === "string" ? params.caCode : "",
        "i",
      ),
    };

    // find the CA applications for the event

    const caApplications = await EventCA.find({
      eventId: event._id,
      ...regex,
      ...statusFilter,
      ...experienceFilter,
    })
      .lean()
      .sort(
        sort && Object.keys(sort).length > 0 && "id" in sort && "desc" in sort
          ? { [String(sort.id)]: sort.desc === "true" ? -1 : 1 }
          : { createdAt: -1 },
      )
      .select(
        "_id name email phoneNumber facebookUrl photoUrl applicationDate hasPreviousExperience status caCode score",
      );

    const totalCount = caApplications.length;
    const paginatedApplications = caApplications.slice(skip, skip + perPage);

    res
      .status(200)
      .json({ results: paginatedApplications, selectedCount: totalCount });
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
  try {
    const applicationId = req.params.applicationId;
    const eventSlug = req.params.eventSlug;
    if (!applicationId || !eventSlug) {
      res
        .status(400)
        .json({ message: "Application ID and Event Slug are required" });
      return;
    }

    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // get the ca with their registrations that used their ca code
    const caApplication = await EventCA.findOne({
      _id: applicationId,
      eventId: event._id,
    })
      .lean()
      .select(
        "_id name email phoneNumber facebookUrl photoUrl address gender institution grade hasPreviousExperience previousExperienceDetails description applicationDate status caCode rejectionReason score",
      );
    if (!caApplication) {
      res.status(404).json({ message: "CA application not found" });
      return;
    }

    const registrationsUsingCACode = await EventRegistration.find({
      $and: [
        { reference: { $eq: caApplication.caCode } },
        {
          reference: { $ne: "N/A" },
        },
      ],
      eventId: event._id,
    })
      .lean()
      .select("_id name email status photoUrl");

    res
      .status(200)
      .json({ applicationDetails: caApplication, registrationsUsingCACode });
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
