import { Request, Response } from "express";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import EventCA from "../models/EventCA.js";
import { eventRegistrationSchema } from "../lib/validation/event-registration-schema.js";
import { uploadImage } from "../lib/file-uploader.js";
import { generateCode } from "../utils/generate-code.js";

// get all event registrations
export async function getAllEventRegistrations(req: Request, res: Response) {
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

    // find the registrations for the event
    const registrations = await EventRegistration.find({
      event: event._id,
    }).lean();

    res.status(200).json({ registrations });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

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

// register a new participant for an event
export async function registerForEvent(req: Request, res: Response) {
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

    // create a new event registration
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { error: validationError } = eventRegistrationSchema.validate(body);
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
      `events/${eventSlug}/registrations`,
    );

    // update the CA score if CA code is provided and valid
    if (body.caCode) {
      const caApplication = await EventCA.findOneAndUpdate(
        { caCode: body.caCode, event: event._id },
        { $inc: { score: 1 } }, // Increment score by 1 for each valid registration
        { new: true },
      );
      if (!caApplication) {
        console.warn(`Invalid CA code provided: ${body.name} - ${body.caCode}`);
      }
    }

    // generate a unique registration code and create the registration record
    const code = generateCode(6);
    const registration = await EventRegistration.create({
      event: event._id,
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      facebookUrl: body.facebookUrl,
      photoUrl: url,
      photoPublicId: imgId,
      institution: body.institution,
      grade: body.grade,
      segments: body.segments,
      transactionMethod: body.transactionMethod,
      transactionPhoneNumber: body.transactionPhoneNumber,
      transactionId: body.transactionId,
      reference: body.reference,
      registrationDate: new Date().toISOString(),
      code,
    });

    console.log(
      `New registration for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
