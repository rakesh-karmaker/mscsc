import { Request, Response } from "express";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import EventCA from "../models/event-ca.model.js";
import { eventRegistrationSchema } from "../schemas/event-registration.schema.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { generateCode } from "../../../shared/utils/generate-code.js";
import { sendEmail } from "../../../shared/lib/mail-sender.js";
import { eventConfirmationDraft } from "../../../shared/utils/otp-draft.js";

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

// get a specific registration by ID
export async function getRegistrationById(req: Request, res: Response) {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      return res.status(400).json({ message: "Registration ID is required" });
    }

    const registration =
      await EventRegistration.findById(registrationId).lean();
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ registration });
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
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

    event.participantCount = (event.participantCount || 0) + 1;
    await event.save();

    console.log(
      `New registration for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// validate a registration (admin action)
export async function validateRegistration(req: Request, res: Response) {
  try {
    const registrationId = req.params.registrationId;
    const eventSlug = req.params.eventSlug;
    if (!registrationId || !eventSlug) {
      return res
        .status(400)
        .json({ message: "Registration ID and event slug are required" });
    }

    const event = await Event.findOne({ eventSlug });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // send the registration mail
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

    registration.isVerified = true;
    await registration.save();

    console.log(
      `${req.user?._id} - Registration validated for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(200).json({ message: "Registration validated and email sent" });
  } catch (error) {
    console.error("Error validating registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// edit a registration (admin action)
export async function editRegistration(req: Request, res: Response) {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      return res.status(400).json({ message: "Registration ID is required" });
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const body = req.body;
    const newRegistration = await EventRegistration.findByIdAndUpdate(
      registrationId,
      {
        $set: {
          isVerified:
            body.isVerified !== undefined
              ? body.isVerified
              : registration.isVerified,
          hasAttended:
            body.hasAttended !== undefined
              ? body.hasAttended
              : registration.hasAttended,
        },
      },
      { new: true },
    ); // added { new: true } to return the updated document

    res
      .status(200)
      .json({ message: "Registration updated", registration: newRegistration });
  } catch (error) {
    console.error("Error editing registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// delete a registration (admin action)
export async function deleteRegistration(req: Request, res: Response) {
  try {
    const registrationId = req.params.registrationId;
    if (!registrationId) {
      return res.status(400).json({ message: "Registration ID is required" });
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const event = await Event.findById(registration.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    deleteFile(registration.photoPublicId);

    await registration.deleteOne();

    event.participantCount = Math.max((event.participantCount || 1) - 1, 0);
    await event.save();

    console.log(
      `${req.user?._id} - Registration deleted for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(200).json({ message: "Registration deleted" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
