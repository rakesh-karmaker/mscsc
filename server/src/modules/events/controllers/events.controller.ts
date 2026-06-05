import { Request, Response } from "express";
import { eventFormSchema } from "../schemas/event.schema.js";
import { EventDataType } from "../event.types.js";
import { generateSlugFromTitle } from "../../../shared/utils/generate-slug.js";
import {
  deleteFile,
  deleteFolder,
  uploadJsonFile,
  renameFolder,
} from "../../../shared/lib/file-uploader.js";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import EventCA from "../models/event-ca.model.js";
import EventTeam from "../models/event-team.model.js";
import getCategory from "../utils/get-category.js";
import logger from "../../../shared/config/winston.js";
import {
  parseRequestBodyJson,
  validateBodySchema,
} from "../utils/request-parser.js";
import { buildEventData } from "../services/event-data.service.js";
import { processEventAssets } from "../services/event-files-upload.service.js";
import ClubPartner from "../models/club-partner.model.js";
import urlChanger from "../utils/url-changer.js";

// get all events
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await Event.find()
      .select(
        req.headers.shorten === "true"
          ? "eventName eventSlug"
          : "eventName eventSlug eventLogoUrl eventBannerUrl eventDescription eventLocation eventDate participantCount segments",
      )
      .lean();

    res.status(200).send(events);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching all events", {
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
          ? "dataUrl hideRegistrationForm hideCAForm isHidden participantCount segments"
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
        status: "validated",
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

      // calculate segment counts
      const segments = event.segments.map((segment) => segment.segmentSlug);
      const segmentCounts: { [segment: string]: number } = {};
      for (const segment of segments) {
        segmentCounts[segment] = registrations.filter((registration) =>
          registration.segments.includes(segment),
        ).length;
      }

      // calculate income from registrations
      let income: number =
        event.fees !== "N/A"
          ? registrations.length * parseFloat(event.fees)
          : 0;

      // if there are paid segments, calculate income based on the segments registered for each registration
      const segmentFeeMap: { [segment: string]: number } = {};
      for (const segment of event.segments.filter(
        (segment) => segment.isPaidSegment,
      )) {
        segmentFeeMap[segment.segmentSlug] = segment.fees || 0;
      }
      for (const registration of registrations) {
        for (const segment of registration.segments) {
          if (segmentFeeMap[segment]) {
            income += segmentFeeMap[segment];
          }
        }
      }

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
        segmentCounts,
        eventName: event.eventName,
        hideRegistrationForm: event.hideRegistrationForm,
        hideCAForm: event.hideCAForm,
        isHidden: event.isHidden,
        segments: event.segments,
      });
      return;
    }

    res.status(200).send({
      eventSlug: event.eventSlug,
      dataUrl: event.dataUrl,
      hideRegistrationForm: event.hideRegistrationForm,
      hideCAForm: event.hideCAForm,
      isHidden: event.isHidden,
      participantCount: event.participantCount,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching event by slug", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug: req.params.eventSlug,
    });
  }
}

// create a new event
export async function createEvent(req: Request, res: Response): Promise<void> {
  const body = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    if (!parseRequestBodyJson(body, res)) return;
    if (!validateBodySchema(eventFormSchema, body, res)) return;

    if (
      !files["eventLogo"] ||
      files["eventLogo"].length === 0 ||
      !files["eventFavicon"] ||
      files["eventFavicon"].length === 0 ||
      !files["eventBanner"] ||
      files["eventBanner"].length === 0
    ) {
      res.status(400).send({
        subject: "eventLogo/eventFavicon",
        message: "Event logo and favicon are required",
      });
      return;
    }

    // at this point, the data is valid and we can proceed with event creation logic
    const eventSlug = generateSlugFromTitle(
      body.basicInfo?.eventName || "",
      false,
    );
    const existingEvent = await Event.findOne({ eventSlug });
    if (existingEvent) {
      res
        .status(400)
        .json({ message: "An event with the same name already exists" });
      return;
    }

    const eventData: EventDataType | null = await buildEventData(
      body,
      files,
      eventSlug,
    );
    if (!eventData) {
      res.status(400).send({ message: "Invalid event data" });
      return;
    }

    const assets = await processEventAssets(files, eventSlug);
    Object.assign(eventData, assets);

    const { url: jsonUrl, jsonPublicId } = await uploadJsonFile(
      eventData,
      `event-data-${eventSlug}`,
      `events/${eventSlug}`,
    );

    const newEvent = await Event.create({
      eventSlug,
      eventName: eventData.eventName,

      ...assets,

      registrationDeadline: eventData.formData.registrationDeadline || "N/A",
      caApplicationDeadline: eventData.caFormData?.applicationDeadline || "N/A",

      // by default, we hide the registration and CA forms until the admin explicitly enables them
      hideRegistrationForm: true,
      hideCAForm: true,

      eventDescription: eventData.eventDescription,
      eventLocation: eventData.eventLocation,
      eventDate: eventData.eventDate,
      participantCount: 0,
      segments: eventData.segmentsData
        ? eventData.segmentsData.map((segment) => {
            return {
              segmentSlug: segment.segmentSlug,
              isTeamSegment: segment.teamType === "team",
              isPaidSegment: segment.isPaidSegment || false,
              price: segment.fees || 0,
            };
          })
        : [],
      fees: eventData.fees || "N/A",

      isHidden: true,

      dataUrl: jsonUrl,
      dataPublicId: jsonPublicId,
    });

    res.status(201).send({
      message: "Event created successfully",
      eventSlug: newEvent.eventSlug,
    });
    logger.log(
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
    logger.error("Error creating event", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      creator: req.user?._id,
    });
  }
}

// edit an existing event by slug
export async function editEvent(req: Request, res: Response): Promise<void> {
  const { eventSlug } = req.params;

  const body = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const existingEvent = await Event.findOne({ eventSlug });
    if (!existingEvent) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

    if (!parseRequestBodyJson(body, res)) return;
    if (!validateBodySchema(eventFormSchema, body, res)) return;

    const newSlug = generateSlugFromTitle(
      body.basicInfo?.eventName || "",
      false,
    );
    if (newSlug !== eventSlug) {
      logger.warn(
        `Event slug is changing from ${eventSlug} to ${newSlug}. This will affect all existing registrations, CAs, teams and club partners associated with this event.`,
        {
          eventId: existingEvent._id,
          oldSlug: eventSlug,
          newSlug,
          editor: req.user?._id,
        },
      );
      await renameFolder(`events/${eventSlug}`, newSlug);

      // update the registration, CA and Club Partner records to reflect the new event slug in their ImageKit folder paths
      const registrations = await EventRegistration.find({
        eventId: existingEvent._id,
      });
      for (const registration of registrations) {
        if (registration.photoUrl && registration.photoPublicId) {
          registration.photoUrl = urlChanger(
            eventSlug,
            newSlug,
            registration.photoUrl,
          );
        }
        await registration.save();
      }

      const eventCAs = await EventCA.find({
        eventId: existingEvent._id,
      });
      for (const ca of eventCAs) {
        if (ca.photoUrl && ca.photoPublicId) {
          ca.photoUrl = urlChanger(eventSlug, newSlug, ca.photoUrl);
        }
        await ca.save();
      }

      const clubPartners = await ClubPartner.find({
        eventId: existingEvent._id,
      });
      for (const partner of clubPartners) {
        if (partner.clubLogoUrl && partner.clubLogoPublicId) {
          partner.clubLogoUrl = urlChanger(
            eventSlug,
            newSlug,
            partner.clubLogoUrl,
          );
        }
        await partner.save();
      }
    }

    const eventData: EventDataType | null = await buildEventData(
      body,
      files,
      newSlug,
      eventSlug,
    );
    if (!eventData) {
      res.status(400).send({ message: "Invalid event data" });
      return;
    }

    const assets = await processEventAssets(files, newSlug, existingEvent);
    Object.assign(eventData, assets);

    await deleteFile(existingEvent.dataPublicId);

    const { url: jsonUrl, jsonPublicId } = await uploadJsonFile(
      eventData,
      `event-data-${newSlug}`,
      `events/${newSlug}`,
    );

    const updatedEvent = await Event.findOneAndUpdate(
      {
        eventSlug,
      },
      {
        eventSlug: newSlug,
        eventName: eventData.eventName,

        ...assets,

        registrationDeadline: eventData.formData.registrationDeadline || "N/A",
        caApplicationDeadline:
          eventData.caFormData?.applicationDeadline || "N/A",

        eventDescription: eventData.eventDescription,
        eventLocation: eventData.eventLocation,
        eventDate: eventData.eventDate,
        participantCount: existingEvent.participantCount,
        segments: eventData.segmentsData
          ? eventData.segmentsData.map((segment) => {
              return {
                segmentSlug: segment.segmentSlug,
                isTeamSegment: segment.teamType === "team",
                isPaidSegment: segment.isPaidSegment || false,
                fees: segment.fees,
              };
            })
          : [],
        fees: eventData.fees || "N/A",

        isHidden: true,

        dataUrl: jsonUrl,
        dataPublicId: jsonPublicId,
      },
    );
    if (!updatedEvent) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

    res.status(201).send({ eventSlug: newSlug });
    logger.log(
      "info",
      `Event Updated: ${updatedEvent.eventName} (${updatedEvent._id})`,
      {
        eventId: updatedEvent._id,
        eventSlug: updatedEvent.eventSlug,
        creator: req.user?._id,
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error editing event", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug,
      editor: req.user?._id,
    });
  }
}

// edit the meta data
export async function editEventMeta(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug } = req.params;
  if (!eventSlug) {
    res
      .status(400)
      .send({ subject: "slug", message: "Event slug is required" });
    return;
  }

  try {
    const body = req.body;
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

    if (body.isHidden !== undefined) {
      event.isHidden = body.isHidden;
    }

    if (body.hideRegistrationForm !== undefined) {
      event.hideRegistrationForm = body.hideRegistrationForm;
    }

    if (body.hideCAForm !== undefined) {
      event.hideCAForm = body.hideCAForm;
    }

    await event.save();

    res.status(200).send({ message: "Event meta updated successfully" });
    logger.log(
      "info",
      `Event meta updated: ${event.eventName} (${event._id})`,
      {
        eventId: event._id,
        eventSlug: event.eventSlug,
        updatedFields: Object.keys(body),
        updater: req.user?._id,
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error editing event meta", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug: req.params.eventSlug,
      updater: req.user?._id,
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

    await Event.deleteOne({ eventSlug: eventSlug });
    await EventRegistration.deleteMany({ eventId: event._id });
    await EventCA.deleteMany({ eventId: event._id });
    await EventTeam.deleteMany({ eventId: event._id });
    await ClubPartner.deleteMany({ eventIds: event._id });
    try {
      await deleteFolder(`events/${eventSlug}`);
    } catch (err) {
      logger.error("Error deleting event folder", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        eventSlug,
      });
    }

    res.status(200).send({ message: "Event deleted successfully" });
    logger.log("info", `Event deleted: ${event.eventName} (${event._id})`, {
      eventId: event._id,
      eventSlug: event.eventSlug,
      deletedBy: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error deleting event", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      eventSlug: req.params.eventSlug,
      deletedBy: req.user?._id,
    });
  }
}
