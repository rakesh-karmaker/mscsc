import { Request, Response } from "express";
import { eventFormSchema } from "../schemas/event.schema.js";
import {
  AboutDataType,
  EventDataType,
  FormDataType,
  SpType,
} from "../event.types.js";
import { generateSlugFromTitle } from "../../../shared/utils/generate-slug.js";
import {
  deleteFolder,
  uploadImage,
  uploadJsonFile,
  uploadMultipleImages,
  uploadVideo,
} from "../../../shared/lib/file-uploader.js";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import EventCA from "../models/event-ca.model.js";
import EventTeam from "../models/event-team.model.js";
import { logEvent } from "../../../shared/utils/log-event.js";
import getCategory from "../utils/get-category.js";

// get all events
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await Event.find().select(
      req.headers.shorten === "true"
        ? "eventName eventSlug"
        : "eventName eventSlug eventLogoUrl eventBannerUrl eventDescription eventLocation eventDate participantCount segments isUpcoming",
    );

    res.status(200).send(events);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    await logEvent("error", "Error fetching all events", {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// get event by slug
export async function getEventBySlug(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { eventSlug } = req.params;
    const shorten = req.headers.shorten === "true";

    const event = await Event.findOne({ eventSlug: eventSlug })
      .select(
        shorten
          ? "dataUrl hideRegistrationForm hideCAForm participantCount"
          : "-__v",
      )
      .lean();
    if (!event) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

    if (req.user && req.headers.details === "true") {
      const registrations = await EventRegistration.find({
        eventId: event._id,
        // status: "validated",
      }).lean();

      const eventCAs = await EventCA.find({
        eventId: event._id,
        status: "approved",
      }).lean();

      const teams = await EventTeam.find({
        eventId: event._id,
        status: "approved",
      })
        .lean()
        .countDocuments();

      const income =
        event.fees !== "N/A"
          ? registrations.length * parseFloat(event.fees)
          : "N/A";

      const categoryCounts: { [category: string]: number } = {
        Primary: 0,
        Junior: 0,
        Secondary: 0,
        "Higher Secondary": 0,
      };
      registrations.forEach((registration) => {
        const grade = registration.grade;
        const category = getCategory(grade);
        if (categoryCounts[category] !== undefined) {
          categoryCounts[category]++;
        }
      });

      res.status(200).send({
        registrations: registrations.length,
        income,
        eventCAs: eventCAs.length,
        teams: teams,
        categoryCounts,
        segments: event.segments,
      });
      return;
    }

    res.status(200).send(event);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    await logEvent("error", "Error fetching event by slug", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug: req.params.eventSlug,
    });
  }
}

// create a new event
export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // validate and parse JSON fields in the request body
    for (const key in body) {
      if (typeof body[key] === "string") {
        try {
          body[key] = JSON.parse(body[key]);
        } catch (err) {
          // If parsing fails, keep the original string value
          res.status(400).send({
            subject: key,
            message: `Invalid JSON format for field ${key}`,
          });
          return;
        }
      }
    }

    const { error: validationError } = eventFormSchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    if (
      !files["eventLogo"] ||
      files["eventLogo"].length === 0 ||
      !files["eventFavicon"] ||
      files["eventFavicon"].length === 0
    ) {
      res.status(400).send({
        subject: "eventLogo/eventFavicon",
        message: "Event logo and favicon are required",
      });
      return;
    }

    // at this point, the data is valid and we can proceed with event creation logic
    const eventData: EventDataType = {
      ...body.basicInfo,
      sections: body.sections,
      hiddenSections: body.hiddenSections,
      contactLinks: body.contactLinks,
      ...(body.basicInfo.hasCAForm ? { caFormData: body.caFormData } : {}),
    } as EventDataType;

    const eventSlug = generateSlugFromTitle(eventData.eventName, false);

    // check if an event with the same slug already exists
    const existingEvent = await Event.findOne({ eventSlug });
    if (existingEvent) {
      res
        .status(400)
        .json({ message: "An event with the same name already exists" });
      return;
    }

    // upload event logo and favicon first to get their URLs and public IDs
    const { url: eventLogoUrl, imgId: eventLogoPublicId } = await uploadImage(
      files["eventLogo"][0],
      false,
      `events/${eventSlug}/logo`,
    );
    const { url: eventFaviconUrl, imgId: eventFaviconPublicId } =
      await uploadImage(
        files["eventFavicon"][0],
        false,
        `events/${eventSlug}/logo`,
      );

    eventData.eventLogoUrl = eventLogoUrl;
    eventData.eventLogoPublicId = eventLogoPublicId;
    eventData.eventFaviconUrl = eventFaviconUrl;
    eventData.eventFaviconPublicId = eventFaviconPublicId;

    const formData: FormDataType = {
      registrationDeadline: body.formData.registrationDeadline,
    };

    if (eventData.isInnerRegistration) {
      formData.title = body.formData.title;
      formData.details = body.formData.details;
      formData.fees = body.formData.fees;
      eventData.fees = body.formData.fees; // store fees in the main event data for easy access

      // handle QR code files for inner registration
      const transactionMethods: {
        [method: string]: {
          number: string;
          qrCodeUrl?: string;
          qrCodePublicId?: string;
        };
      } = body.formData.transactionMethods || {};
      const qrCodeFields: { [key: string]: string } = {
        bkash: "bkashQrCode",
        nagad: "nagadQrCode",
        rocket: "rocketQrCode",
      };
      Object.keys(qrCodeFields).forEach(async (method) => {
        if (
          transactionMethods[method] &&
          transactionMethods[method].number &&
          files[qrCodeFields[method]] &&
          files[qrCodeFields[method]].length > 0
        ) {
          const file = files[qrCodeFields[method]][0];
          const { url, imgId } = await uploadImage(
            file,
            false,
            `events/${eventSlug}/qr-codes`,
          );

          transactionMethods[method] = {
            number: transactionMethods[method].number,
            qrCodeUrl: url,
            qrCodePublicId: imgId,
          };
        }
      });
      formData.transactionMethods = transactionMethods;
    }

    eventData.formData = formData;

    // handle section-specific data and file uploads
    const sections: string[] = eventData.sections;

    if (sections.includes("hero") && body.heroData) {
      eventData.heroData = body.heroData;
    }

    if (
      sections.includes("video") &&
      files.videoData &&
      files.videoData.length > 0
    ) {
      const file = files.videoData[0];
      const { url, videoId } = await uploadVideo(
        file,
        `events/${eventSlug}/videos`,
      );
      eventData.videoData = {
        url,
        videoPublicId: videoId,
        hasAudio: false, // for simplicity, we're not extracting audio info from the video file. This can be enhanced in the future.
      };
    }

    if (sections.includes("about") && body.aboutData) {
      const aboutData: AboutDataType = body.aboutData;
      if (files.aboutImage && files.aboutImage.length > 0) {
        const file = files.aboutImage[0];
        const { url, imgId } = await uploadImage(
          file,
          false,
          `events/${eventSlug}/about`,
        );
        aboutData.aboutImageUrl = url;
        aboutData.aboutImagePublicId = imgId;
      }

      eventData.aboutData = aboutData;
    }

    if (sections.includes("segments") && body.segmentsData) {
      eventData.segmentsData = body.segmentsData;
    }

    if (sections.includes("experiences") && body.experiencesData) {
      eventData.experiencesData = body.experiencesData;
    }

    if (sections.includes("schedule") && body.scheduleData) {
      eventData.scheduleData = body.scheduleData;
    }

    if (sections.includes("sp") && body.spData) {
      const spData: SpType[] = [];
      const gallery: { url: string; imgId: string }[] =
        await uploadMultipleImages(
          files.spLogos,
          `events/${eventSlug}/sponsors-partners`,
        );
      for (let i = 0; i < body.spData.length; i++) {
        const sp: SpType = body.spData[i];
        if (gallery[i]) {
          sp.logoUrl = gallery[i].url;
          sp.logoPublicId = gallery[i].imgId;
        }
        spData.push(sp);
      }
      eventData.spData = spData;
    }

    if (sections.includes("faq") && body.faqData) {
      eventData.faqData = body.faqData;
    }

    const { url: jsonUrl, jsonPublicId } = await uploadJsonFile(
      eventData,
      `event-data-${eventSlug}`,
      `events/${eventSlug}`,
    );

    const newEvent = await Event.create({
      eventSlug,
      eventName: eventData.eventName,

      eventLogoUrl: eventData.eventLogoUrl,
      eventLogoPublicId: eventData.eventLogoPublicId,

      eventFaviconUrl: eventData.eventFaviconUrl,
      eventFaviconPublicId: eventData.eventFaviconPublicId,

      registrationDeadline: eventData.formData.registrationDeadline || "N/A",
      caApplicationDeadline: eventData.caFormData?.applicationDeadline || "N/A",

      eventDescription: eventData.eventDescription,
      eventLocation: eventData.eventLocation,
      eventDate: eventData.eventDate,
      participantCount: 0,
      segments: eventData.segmentsData
        ? eventData.segmentsData.map((segment) => segment.title)
        : [],
      fees: eventData.fees || "N/A",

      isUpcoming: new Date(eventData.eventDate) > new Date(),
      isHidden: true,

      dataUrl: jsonUrl,
      dataPublicId: jsonPublicId,
    });

    res
      .status(201)
      .send({ message: "Event created successfully", event: newEvent });
    await logEvent(
      "info",
      `Event created: ${newEvent.eventName} (${newEvent._id})`,
      {
        eventId: newEvent._id,
        eventSlug: newEvent.eventSlug,
        creator: req.user?._id,
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    await logEvent("error", "Error creating event", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      creator: req.user?._id,
    });
  }
}

// delete an event by slug
export async function deleteEvent(req: Request, res: Response): Promise<void> {
  try {
    const { eventSlug } = req.params;
    const event = await Event.findOne({ eventSlug: eventSlug });
    if (!event) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

    deleteFolder(`events/${eventSlug}`);
    await Event.deleteOne({ eventSlug: eventSlug });
    await EventRegistration.deleteMany({ eventId: event._id });
    await EventCA.deleteMany({ eventId: event._id });
    await EventTeam.deleteMany({ eventId: event._id });

    res.status(200).send({ message: "Event deleted successfully" });
    await logEvent("info", `Event deleted: ${event.eventName} (${event._id})`, {
      eventId: event._id,
      eventSlug: event.eventSlug,
      deletedBy: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    await logEvent("error", "Error deleting event", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug: req.params.eventSlug,
      deletedBy: req.user?._id,
    });
  }
}
