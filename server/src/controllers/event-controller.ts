import { Request, Response } from "express";
import { eventFormSchema } from "../lib/validation/event-form-schema.js";
import {
  AboutDataType,
  EventDataType,
  FormDataType,
  SpType,
} from "../types/event-types.js";
import { generateSlugFromTitle } from "../utils/generate-slug.js";
import {
  uploadImage,
  uploadJsonFile,
  uploadMultipleImages,
  uploadVideo,
} from "../lib/image-uploader.js";
import Event from "../models/Event.js";

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

    const eventSlug = generateSlugFromTitle(eventData.eventName);

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

      eventDescription: eventData.eventDescription,
      eventLocation: eventData.eventLocation,
      eventDate: eventData.eventDate,
      participantCount: 0,
      segmentCount: eventData.segmentsData ? eventData.segmentsData.length : 0,

      isUpcoming: new Date(eventData.eventDate) > new Date(),
      isHidden: true,

      dataUrl: jsonUrl,
      dataPublicId: jsonPublicId,
    });

    res
      .status(201)
      .send({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.log("Error creating event - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
