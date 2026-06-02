import { Request, Response } from "express";
import { eventFormSchema } from "../schemas/event.schema.js";
import {
  AboutDataType,
  EventDataType,
  FormDataType,
  SegmentType,
  SpType,
} from "../event.types.js";
import { generateSlugFromTitle } from "../../../shared/utils/generate-slug.js";
import {
  deleteFile,
  deleteFolder,
  uploadImage,
  uploadJsonFile,
  uploadMultipleImages,
  uploadVideo,
  renameFolder,
} from "../../../shared/lib/file-uploader.js";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import EventCA from "../models/event-ca.model.js";
import EventTeam from "../models/event-team.model.js";
import getCategory from "../utils/get-category.js";
import logger from "../../../shared/config/winston.js";
import urlChanger from "../utils/url-changer.js";

// get all events
export async function getAllEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await Event.find().select(
      req.headers.shorten === "true"
        ? "eventName eventSlug"
        : "eventName eventSlug eventLogoUrl eventBannerUrl eventDescription eventLocation eventDate participantCount segments",
    );

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

    const { url: eventBannerUrl, imgId: eventBannerPublicId } =
      await uploadImage(files["eventBanner"][0], false, `events/${eventSlug}`);

    eventData.eventLogoUrl = eventLogoUrl;
    eventData.eventLogoPublicId = eventLogoPublicId;
    eventData.eventFaviconUrl = eventFaviconUrl;
    eventData.eventFaviconPublicId = eventFaviconPublicId;
    eventData.eventBannerUrl = eventBannerUrl;
    eventData.eventBannerPublicId = eventBannerPublicId;

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

      for (const method of Object.keys(qrCodeFields)) {
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
      }
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
      const segmentData: SegmentType[] = [];
      const qrCodeImages: Express.Multer.File[] =
        files["segmentTMethodQrs"] || [];

      for (const segment of body.segmentsData) {
        const segmentDataItem: SegmentType = {
          segmentSlug: segment.segmentSlug,
          locationType: segment.locationType,
          teamType: segment.teamType,
          icon: segment.icon,
          title: segment.title,
          summary: segment.summary,
          details: segment.details,
          rules: segment.rules,
          maxTeamSize: segment.maxTeamSize,
          isPaidSegment: segment.isPaidSegment || false,
          fees: parseFloat(segment.fees) || 0,
        };

        if (!segment.transactionMethods) {
          segmentData.push(segmentDataItem);
          return;
        }

        const methods = Object.keys(segment.transactionMethods || {});
        for (const method of methods) {
          if (!segment.transactionMethods[method].number) return;

          if (!segmentDataItem.transactionMethods) {
            segmentDataItem.transactionMethods = {};
          }

          const transactionMethod: {
            number: string;
            qrCodeUrl?: string;
            qrCodePublicId?: string;
          } = {} as {
            number: string;
            qrCodeUrl?: string;
            qrCodePublicId?: string;
          };

          if (segment.transactionMethods[method].number) {
            transactionMethod["number"] =
              segment.transactionMethods[method].number;
          }

          // check if a QR code file was uploaded for this transaction method
          if (segment.transactionMethods[method]?.code) {
            const qrCodeFile = qrCodeImages.find(
              (file) =>
                file.originalname.split(".")[0] ===
                segment.transactionMethods[method].code,
            );
            if (qrCodeFile) {
              const { url, imgId } = await uploadImage(
                qrCodeFile,
                false,
                `events/${eventSlug}/transaction-methods`,
              );
              transactionMethod["qrCodeUrl"] = url;
              transactionMethod["qrCodePublicId"] = imgId;
            }
          }

          segmentDataItem.transactionMethods[method] = transactionMethod;
        }

        if (
          Object.keys(segmentDataItem.transactionMethods || {}).length === 0
        ) {
          delete segmentDataItem.transactionMethods;
        }
        segmentData.push(segmentDataItem);
      }

      eventData.segmentsData = segmentData;
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

    if (sections.includes("faqs") && body.faqData) {
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

      eventBannerUrl: eventData.eventBannerUrl,
      eventBannerPublicId: eventData.eventBannerPublicId,

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
    logger.log(`Event created: ${newEvent.eventName} (${newEvent._id})`, {
      eventId: newEvent._id,
      eventSlug: newEvent.eventSlug,
      creator: req.user?._id,
    });
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
  try {
    const existingEvent = await Event.findOne({ eventSlug });
    if (!existingEvent) {
      res.status(404).send({ subject: "slug", message: "Event not found" });
      return;
    }

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

    // at this point, the data is valid and we can proceed with event creation logic
    const eventData: EventDataType = {
      ...body.basicInfo,
      sections: body.sections,
      hiddenSections: body.hiddenSections,
      contactLinks: body.contactLinks,
      ...(body.basicInfo.hasCAForm ? { caFormData: body.caFormData } : {}),
    } as EventDataType;

    const newSlug = generateSlugFromTitle(eventData.eventName, false);

    if (newSlug !== eventSlug) {
      await renameFolder(`events/${eventSlug}`, newSlug);
    }

    eventData.eventLogoUrl = urlChanger(
      eventSlug,
      newSlug,
      existingEvent.eventLogoUrl,
    );
    eventData.eventLogoPublicId = existingEvent.eventLogoPublicId;
    eventData.eventFaviconUrl = urlChanger(
      eventSlug,
      newSlug,
      existingEvent.eventFaviconUrl,
    );
    eventData.eventFaviconPublicId = existingEvent.eventFaviconPublicId;
    eventData.eventBannerUrl = urlChanger(
      eventSlug,
      newSlug,
      existingEvent.eventBannerUrl,
    );
    eventData.eventBannerPublicId = existingEvent.eventBannerPublicId;

    if (files["eventLogo"] && files["eventLogo"].length > 0) {
      await deleteFile(existingEvent.eventLogoPublicId);

      // upload event logo and favicon first to get their URLs and public IDs
      const { url: eventLogoUrl, imgId: eventLogoPublicId } = await uploadImage(
        files["eventLogo"][0],
        false,
        `events/${newSlug}/logo`,
      );

      eventData.eventLogoUrl = eventLogoUrl;
      eventData.eventLogoPublicId = eventLogoPublicId;
    }

    if (files["eventFavicon"] && files["eventFavicon"].length > 0) {
      const { url: eventFaviconUrl, imgId: eventFaviconPublicId } =
        await uploadImage(
          files["eventFavicon"][0],
          false,
          `events/${newSlug}/logo`,
        );

      eventData.eventFaviconUrl = eventFaviconUrl;
      eventData.eventFaviconPublicId = eventFaviconPublicId;
    }

    if (files["eventBanner"] && files["eventBanner"].length > 0) {
      const { url: eventBannerUrl, imgId: eventBannerPublicId } =
        await uploadImage(files["eventBanner"][0], false, `events/${newSlug}`);
      eventData.eventBannerUrl = eventBannerUrl;
      eventData.eventBannerPublicId = eventBannerPublicId;
    }

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

      for (const method of Object.keys(qrCodeFields)) {
        if (
          transactionMethods[method] &&
          transactionMethods[method].number &&
          files[qrCodeFields[method]] &&
          files[qrCodeFields[method]].length > 0
        ) {
          if (transactionMethods[method].qrCodePublicId) {
            await deleteFile(transactionMethods[method].qrCodePublicId || "");
          }

          const file = files[qrCodeFields[method]][0];
          const { url, imgId } = await uploadImage(
            file,
            false,
            `events/${newSlug}/qr-codes`,
          );

          transactionMethods[method] = {
            number: transactionMethods[method].number,
            qrCodeUrl: url,
            qrCodePublicId: imgId,
          };
        } else if (
          transactionMethods[method] &&
          transactionMethods[method].number
        ) {
          if (
            transactionMethods[method].qrCodeUrl &&
            transactionMethods[method].qrCodePublicId
          ) {
            transactionMethods[method] = {
              number: transactionMethods[method].number,
              qrCodeUrl: urlChanger(
                eventSlug,
                newSlug,
                transactionMethods[method].qrCodeUrl,
              ),
              qrCodePublicId: transactionMethods[method].qrCodePublicId,
            };
          } else {
            transactionMethods[method] = {
              number: transactionMethods[method].number,
            };
          }
        } else {
          // if the transaction method is removed, delete the existing QR code file
          if (transactionMethods[method]?.qrCodePublicId) {
            await deleteFile(transactionMethods[method].qrCodePublicId || "");
          }
          delete transactionMethods[method];
        }
      }
      formData.transactionMethods = transactionMethods;
    }

    eventData.formData = formData;

    // handle section-specific data and file uploads
    const sections: string[] = eventData.sections;

    if (sections.includes("hero") && body.heroData) {
      eventData.heroData = body.heroData;
    }

    if (sections.includes("video")) {
      if (files.videoData && files.videoData.length > 0) {
        await deleteFile(existingEvent.dataPublicId);
        const file = files.videoData[0];
        const { url, videoId } = await uploadVideo(
          file,
          `events/${newSlug}/videos`,
        );
        eventData.videoData = {
          url,
          videoPublicId: videoId,
          hasAudio: false, // for simplicity, we're not extracting audio info from the video file. This can be enhanced in the future.
        };
      } else {
        eventData.videoData = {
          url: urlChanger(eventSlug, newSlug, existingEvent.dataUrl),
          videoPublicId: body.videoData.videoPublicId,
          hasAudio: false,
        };
      }
    }

    if (sections.includes("about") && body.aboutData) {
      const aboutData: AboutDataType = body.aboutData;
      if (files.aboutImage && files.aboutImage.length > 0) {
        if (aboutData.aboutImagePublicId) {
          await deleteFile(aboutData.aboutImagePublicId);
        }

        const file = files.aboutImage[0];
        const { url, imgId } = await uploadImage(
          file,
          false,
          `events/${newSlug}/about`,
        );
        aboutData.aboutImageUrl = url;
        aboutData.aboutImagePublicId = imgId;
      } else if (aboutData.aboutImageUrl && aboutData.aboutImagePublicId) {
        aboutData.aboutImageUrl = urlChanger(
          eventSlug,
          newSlug,
          aboutData.aboutImageUrl,
        );
        aboutData.aboutImagePublicId = aboutData.aboutImagePublicId;
      }

      eventData.aboutData = aboutData;
    }

    if (sections.includes("segments") && body.segmentsData) {
      const segmentData: SegmentType[] = [];
      const qrCodeImages: Express.Multer.File[] =
        files["segmentTMethodQrs"] || [];

      for (const segment of body.segmentsData) {
        const segmentDataItem: SegmentType = {
          segmentSlug: segment.segmentSlug,
          locationType: segment.locationType,
          teamType: segment.teamType,
          icon: segment.icon,
          title: segment.title,
          summary: segment.summary,
          details: segment.details,
          rules: segment.rules,
          maxTeamSize: segment.maxTeamSize,
          isPaidSegment: segment.isPaidSegment || false,
          fees:
            typeof segment.fees === "string"
              ? parseFloat(segment.fees)
              : segment.fees || 0,
        };

        if (!segment.transactionMethods) {
          segmentData.push(segmentDataItem);
          continue;
        }

        const methods = Object.keys(segment.transactionMethods || {});
        for (const method of methods) {
          if (!segment.transactionMethods[method].number) continue;

          if (!segmentDataItem.transactionMethods) {
            segmentDataItem.transactionMethods = {};
          }

          const transactionMethod: {
            number: string;
            qrCodeUrl?: string;
            qrCodePublicId?: string;
          } = {} as {
            number: string;
            qrCodeUrl?: string;
            qrCodePublicId?: string;
          };

          if (segment.transactionMethods[method].number) {
            transactionMethod["number"] =
              segment.transactionMethods[method].number;
          }

          // check if a QR code file was uploaded for this transaction method
          if (segment.transactionMethods[method]?.code) {
            if (segment.transactionMethods[method]?.qrCodePublicId) {
              await deleteFile(
                segment.transactionMethods[method].qrCodePublicId || "",
              );
            }

            const qrCodeFile = qrCodeImages.find(
              (file) =>
                file.originalname.split(".")[0] ===
                segment.transactionMethods[method].code,
            );
            if (qrCodeFile) {
              const { url, imgId } = await uploadImage(
                qrCodeFile,
                false,
                `events/${eventSlug}/transaction-methods`,
              );
              transactionMethod["qrCodeUrl"] = url;
              transactionMethod["qrCodePublicId"] = imgId;
            }
          } else if (segment.transactionMethods[method]?.qrCodeUrl) {
            transactionMethod["qrCodeUrl"] =
              segment.transactionMethods[method].qrCodeUrl;
            transactionMethod["qrCodePublicId"] =
              segment.transactionMethods[method].qrCodePublicId || "";
          }

          segmentDataItem.transactionMethods[method] = transactionMethod;
        }

        if (Object.keys(segment.transactionMethods || {}).length === 0) {
          delete segmentDataItem.transactionMethods;
        }
        segmentData.push(segmentDataItem);
      }

      eventData.segmentsData = segmentData;
    }

    if (sections.includes("experiences") && body.experiencesData) {
      eventData.experiencesData = body.experiencesData;
    }

    if (sections.includes("schedule") && body.scheduleData) {
      eventData.scheduleData = body.scheduleData;
    }

    if (sections.includes("sp") && body.spData) {
      const spData: SpType[] = [];
      if (files.spLogos && files.spLogos.length > 0) {
        const newSPLogos: { [publicId: string]: Express.Multer.File } = {};
        files.spLogos.forEach((file) => {
          newSPLogos[file.originalname] = file;
        });

        for (const sp of body.spData) {
          if (sp.logoPublicId && newSPLogos[sp.logoPublicId]) {
            await deleteFile(sp.logoPublicId);

            const { url, imgId } = await uploadImage(
              newSPLogos[sp.logoPublicId],
              false,
              `events/${newSlug}/sponsors-partners`,
            );

            spData.push({
              name: sp.name,
              websiteUrl: sp.websiteUrl,
              logoUrl: url,
              logoPublicId: imgId,
            });
          } else {
            spData.push({
              name: sp.name,
              websiteUrl: sp.websiteUrl,
              logoUrl: urlChanger(eventSlug, newSlug, sp.logoUrl || ""),
              logoPublicId: sp.logoPublicId,
            });
          }
        }
      } else {
        body.spData.forEach((sp: SpType) => {
          spData.push({
            name: sp.name,
            websiteUrl: sp.websiteUrl,
            logoUrl: urlChanger(eventSlug, newSlug, sp.logoUrl || ""),
            logoPublicId: sp.logoPublicId,
          });
        });
      }

      eventData.spData = spData;
    }

    if (sections.includes("faqs") && body.faqData) {
      eventData.faqData = body.faqData;
    }

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

        eventLogoUrl: eventData.eventLogoUrl,
        eventLogoPublicId: eventData.eventLogoPublicId,

        eventFaviconUrl: eventData.eventFaviconUrl,
        eventFaviconPublicId: eventData.eventFaviconPublicId,

        eventBannerUrl: eventData.eventBannerUrl,
        eventBannerPublicId: eventData.eventBannerPublicId,

        registrationDeadline: eventData.formData.registrationDeadline || "N/A",
        caApplicationDeadline:
          eventData.caFormData?.applicationDeadline || "N/A",

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
      `Event created: ${updatedEvent.eventName} (${updatedEvent._id})`,
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
    logger.log(`Event meta updated: ${event.eventName} (${event._id})`, {
      eventId: event._id,
      eventSlug: event.eventSlug,
      updatedFields: Object.keys(body),
      updater: req.user?._id,
    });
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
    logger.log(`Event deleted: ${event.eventName} (${event._id})`, {
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
