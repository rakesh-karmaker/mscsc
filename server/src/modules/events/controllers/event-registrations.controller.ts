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
import EventTeam from "../models/event-team.model.js";

// get all event registrations
export async function getAllEventRegistrations(
  req: Request,
  res: Response,
): Promise<void> {
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

    const registration =
      await EventRegistration.findById(registrationId).lean();
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    res.status(200).json({ registration });
  } catch (error) {
    console.error("Error fetching registration by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// register a new participant for an event
export async function registerForEvent(
  req: Request,
  res: Response,
): Promise<void> {
  let publicId = ""; // This variable will hold the public ID of the uploaded image, so that we can delete it if any error occurs after the upload

  try {
    const eventSlug = req.params.eventSlug;
    if (!eventSlug) {
      res.status(400).json({ message: "Event slug is required" });
      return;
    }

    // validate the form data using the Zod schema
    const body = req.body;
    const file = req.file;

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

    // find the event by slug
    const event = await Event.findOne({ eventSlug });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // check if registration is hidden or the registration deadline has passed
    const hasDeadlinePassed = new Date() > new Date(event.registrationDeadline);
    if (event.hideRegistrationForm || hasDeadlinePassed) {
      res.status(403).json({
        message: "Registration is closed for this event",
      });
      return;
    }

    // find any previous registration with the same email for this event
    const existingRegistration = await EventRegistration.findOne({
      $and: [
        {
          eventId: event._id,
          email: req.body.email,
          status: { $in: ["pending", "validated"] },
        },
      ],
    });

    if (existingRegistration) {
      res.status(400).json({
        message: "You have already registered for this event with this email",
      });
      return;
    }

    // check for team segment data if the user has selected any team segments
    if (body.teamSegmentsData) {
      // if team data is provided, validate it
      for (const segmentSlug in body.teamSegmentsData) {
        const teamData = body.teamSegmentsData[segmentSlug];
        const isLeader = teamData.leaderEmail === body.email;

        if (!teamData.teamName || !teamData.leaderEmail) {
          res.status(400).json({
            message: "Invalid team data provided",
          });
          return;
        }

        // if the user is the team leader, check if a team with the same name already exists for the same segment in the same event
        if (isLeader) {
          const existingTeam = await EventTeam.findOne({
            $and: [
              { eventId: event._id },
              { segmentSlug: segmentSlug },
              { teamName: teamData.teamName },
              { leaderEmail: { $ne: teamData.leaderEmail } },
            ],
          });

          if (existingTeam) {
            res.status(400).json({
              message: `The team name "${teamData.teamName}" is already taken for the ${segmentSlug} segment. Please choose a different name.`,
            });
            return;
          }

          // check if the members emails are in any other team for the same segment in the same event
          if (teamData.memberEmails && teamData.memberEmails.length > 0) {
            const conflictingTeams = await EventTeam.find({
              $and: [
                { eventId: event._id },
                { segmentSlug: segmentSlug },
                {
                  $or: [
                    { leaderEmail: { $in: teamData.memberEmails } },
                    {
                      memberEmails: {
                        $elemMatch: { $in: teamData.memberEmails },
                      },
                    },
                  ],
                },
              ],
            });
            if (conflictingTeams.length > 0) {
              res.status(400).json({
                message: `One or more member emails are already associated with a team in the ${segmentSlug} segment. Please check your team information.`,
              });
              return;
            }
          }
        } else {
          const existingTeam = await EventTeam.findOne({
            $and: [
              { eventId: event._id },
              { segmentSlug: segmentSlug },
              { teamName: teamData.teamName },
              { leaderEmail: teamData.leaderEmail },
            ],
          });

          if (!existingTeam) {
            res.status(400).json({
              message: `No team found for the ${segmentSlug} segment with the provided leader email ${teamData.leaderEmail} and team name ${teamData.teamName}. Please check your team information.`,
            });
            return;
          }

          // check if the user is a member of the team
          const isMember = existingTeam.memberEmails.includes(body.email);
          if (!isMember) {
            res.status(400).json({
              message: `You are not listed as a member of the team for the ${segmentSlug} segment. Please check your team information and your email.`,
            });
            return;
          }
        }
      }
    }

    // upload the photo and get the URL
    const { url, imgId } = await uploadImage(
      file,
      true,
      `events/${eventSlug}/registrations`,
    );

    if (imgId) {
      publicId = imgId;
    }

    // update the CA score if CA code is provided and valid
    if (body.reference) {
      const caApplication = await EventCA.findOneAndUpdate(
        { caCode: body.reference, eventId: event._id, status: "approved" },
        { $inc: { score: 1 } }, // Increment score by 1 for each valid registration
        { new: true },
      );
      if (!caApplication) {
        console.warn(
          `Invalid CA code provided: ${body.name} - ${body.reference}`,
        );
      }
    }

    // generate a unique registration code and create the registration record
    let code = generateCode(6);
    // Ensure the generated code is unique by checking existing registrations
    let isUnique = false;
    while (!isUnique) {
      const existingRegistration = await EventRegistration.findOne({
        $and: [{ eventId: event._id }, { code }],
      });
      if (!existingRegistration) {
        isUnique = true;
      } else {
        code = generateCode(6);
      }
    }

    const registration = await EventRegistration.create({
      eventId: event._id,
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      facebookUrl: body.facebookUrl,
      photoUrl: url,
      photoPublicId: imgId,
      institution: body.institution,
      grade: body.grade,
      category: body.category,
      segments: body.segments,
      transactionMethod: body.transactionMethod,
      transactionPhoneNumber: body.transactionPhoneNumber,
      transactionId: body.transactionId,
      reference: body.reference?.toString().toUpperCase() || "N/A",
      clubReference: body.clubReference?.toString().toUpperCase() || "N/A",
      registrationDate: new Date().toISOString(),
      code,
    });

    event.participantCount = (event.participantCount || 0) + 1;
    await event.save();

    // create or update the team data if teamSegmentsData is provided
    if (body.teamSegmentsData) {
      // if validation passes, create or update the teams
      for (const segmentSlug in body.teamSegmentsData) {
        const teamData = body.teamSegmentsData[segmentSlug];
        const isLeader = teamData.leaderEmail === body.email;

        if (isLeader) {
          let status: "registering" | "pending" | "approved" = "registering";

          if (teamData.memberEmails && teamData.memberEmails.length > 0) {
            const members = await EventRegistration.find({
              $and: [
                { eventId: event._id },
                { email: { $in: teamData.memberEmails } },
              ],
            });

            if (members.length == teamData.memberEmails.length) {
              status = "pending"; // All members have already registered, move to pending for admin approval
            }
          }

          await EventTeam.create({
            eventId: event._id,
            segmentSlug,
            teamName: teamData.teamName,
            leaderEmail: teamData.leaderEmail,
            memberEmails: teamData.memberEmails || [],
            status: status,
          });
        } else {
          // check if all members and leader have registered
          const members = await EventRegistration.find({
            $and: [
              { eventId: event._id },
              {
                $or: [
                  { email: teamData.leaderEmail },
                  { email: { $in: teamData.memberEmails } },
                ],
              },
            ],
          });

          if (members.length == teamData.memberEmails.length + 1) {
            // update the team status to pending if all members have registered
            await EventTeam.findOneAndUpdate(
              {
                eventId: event._id,
                segmentSlug,
                teamName: teamData.teamName,
                leaderEmail: teamData.leaderEmail,
              },
              { status: "pending" },
            );
          }
        }
      }
    }

    console.log(
      `New registration for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // If an error occurs after the image has been uploaded, delete the uploaded image to prevent orphaned files
    if (publicId) {
      deleteFile(publicId);
    }
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
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
      await sendEmail(
        registration.email,
        `Registration Rejected for ${registration.name}`,
        eventRejectionDraft({
          eventName: event.eventName,
          logoUrl: event.eventLogoUrl,
          reason: registration.rejectionReason || "N/A",
        }),
      );
    }

    registration.status = body.status;
    if (body.status === "rejected") {
      registration.rejectionReason = body.rejectionReason || "N/A";
    }
    await registration.save();

    console.log(
      `${req.user?._id} - Registration status changed to ${registration.status} for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res
      .status(200)
      .json({ message: "Registration status changed and email sent" });
  } catch (error) {
    console.error("Error changing registration status:", error);
    res.status(500).json({ message: "Internal server error" });
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
    return;

    res
      .status(200)
      .json({ message: "Registration updated", registration: newRegistration });
  } catch (error) {
    console.error("Error editing registration:", error);
    res.status(500).json({ message: "Internal server error" });
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

    console.log(
      `${req.user?._id} - Registration deleted for event ${event.eventName}: ${registration.name} (${registration.email})`,
    );
    res.status(200).json({ message: "Registration deleted" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
