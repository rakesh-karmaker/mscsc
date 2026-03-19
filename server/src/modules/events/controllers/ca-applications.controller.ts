import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventCA from "../models/event-ca.model.js";
import { caApplicationSchema } from "../schemas/ca-application.schema.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { sendEmail } from "../../../shared/lib/mail-sender.js";
import {
  caApplicationConfirmationDraft,
  caApplicationRejectionDraft,
} from "../utils/ca-application-drafts.js";

// get all ca applications for an event
export async function getAllCAApplications(req: Request, res: Response) {
  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      return res.status(400).json({ message: "Event slug is required" });
    }

    // find the event by slug
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // find the CA applications for the event
    const caApplications = await EventCA.find({
      event: event._id,
    }).lean();

    res.status(200).json({ caApplications });
  } catch (error) {
    console.error("Error fetching CA applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// get a specific CA application by ID
export async function getCAApplicationById(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const caApplication = await EventCA.findById(applicationId).lean();
    if (!caApplication) {
      return res.status(404).json({ message: "CA application not found" });
    }

    res.status(200).json({ caApplication });
  } catch (error) {
    console.error("Error fetching CA application by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// register a new CA application for an event
export async function applyForCA(req: Request, res: Response) {
  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      return res.status(400).json({ message: "Event slug is required" });
    }

    // find the event by slug
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // create a new CA application
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { error: validationError } = caApplicationSchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    if (!files || !files.photo || files.photo.length === 0) {
      res.status(400).send({
        subject: "photo",
        message: "Photo is required",
      });
      return;
    }

    // upload the photo and get the URL
    const { url, imgId } = await uploadImage(
      files.photo[0],
      true,
      `events/${eventSlug}/ca-applications`,
    );

    const caApplication = await EventCA.create({
      event: event._id,
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
      havePreviousExperience: body.havePreviousExperience,
      description: body.description,
      applicationDate: new Date().toISOString(),
    });

    console.log(
      `New CA application submitted: ${caApplication._id} - ${caApplication.name} for event ${event.eventName}`,
    );

    res.status(201).json({
      message: "CA application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying for CA:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// edit a CA application status for an event
export async function editCAApplicationStatus(req: Request, res: Response) {
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
      return res.status(400).json({
        message: "Event slug, application ID, status, and CA code are required",
      });
    }

    // find the event by slug
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // find the CA application by ID and event
    const caApplication = await EventCA.findOne({
      _id: applicationId,
      event: event._id,
    });
    if (!caApplication) {
      return res.status(404).json({ message: "CA application not found" });
    }

    if (status === "approved") {
      // check if the CA code is unique for the event
      const existingCAWithCode = await EventCA.findOne({
        event: event._id,
        caCode,
        status: "approved",
      });
      if (existingCAWithCode) {
        return res.status(400).json({
          message: "CA code already exists for another approved application",
        });
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
          code: caApplication.caCode,
        }),
      );
    } else if (status === "rejected") {
      await sendEmail(
        caApplication.email,
        `CA Application Rejected for ${event.eventName}`,
        caApplicationRejectionDraft({
          eventName: event.eventName,
          logoUrl: event.eventLogoUrl,
          reason: caApplication.rejectionReason || "N/A",
        }),
      );
    }

    caApplication.status = status;
    if (status === "rejected") {
      caApplication.rejectionReason = req.body.rejectionReason || "N/A";
    } else if (status === "approved") {
      caApplication.caCode = caCode;
    }
    await caApplication.save();

    console.log(
      `${req.user?._id} - CA application ${status} for event ${event.eventName}: ${caApplication.name} (${caApplication.email})`,
    );

    res.status(200).json({ message: "CA application updated and email sent" });
  } catch (error) {
    console.error("Error validating CA application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// edit a CA application for an event
export async function editCAApplication(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const caApplication = await EventCA.findById(applicationId);
    if (!caApplication) {
      return res.status(404).json({ message: "CA application not found" });
    }

    const body = req.body;
    const newCaApplication = await EventCA.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status:
            body.status !== undefined ? body.status : caApplication.status,
        },
      },
      { new: true },
    );

    res.status(200).json({
      message: "CA application updated successfully",
      caApplication: newCaApplication,
    });
  } catch (error) {
    console.error("Error editing CA application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// delete a CA application for an event
export async function deleteCAApplication(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const caApplication = await EventCA.findById(applicationId);
    if (!caApplication) {
      return res.status(404).json({ message: "CA application not found" });
    }

    deleteFile(caApplication.photoPublicId);

    await EventCA.findByIdAndDelete(applicationId);

    res.status(200).json({ message: "CA application deleted successfully" });
  } catch (error) {
    console.error("Error deleting CA application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
