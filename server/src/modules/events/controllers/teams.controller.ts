import { Request, Response } from "express";
import mongoose from "mongoose";
import EventTeam from "../models/event-team.model.js";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";

import { sendEmail } from "../../../shared/lib/mail-sender.js";
import {
  teamRegistrationConfirmationDraft,
  teamRegistrationRejectionDraft,
} from "../utils/team-registration-drafts.js";
import { deSlugify } from "../utils/de-slugify.js";
import logger from "../../../shared/config/winston.js";
import { teamSchema } from "../schemas/team.schema.js";

// get all teams
export async function getAllTeams(req: Request, res: Response): Promise<void> {
  const eventSlug = req.params.eventSlug;
  if (!eventSlug) {
    res.status(400).json({ message: "Event slug is required" });
    return;
  }
  const statusOptions = ["pending", "approved", "rejected"] as const;

  const params = req.query as {
    page?: string;
    perPage?: string;
    sort?: string[];
    teamName?: string;
    status?: (typeof statusOptions)[number][];
    segments?: string[];
  };

  try {
    const event = await Event.findOne({
      eventSlug: eventSlug,
    })
      .select("_id")
      .lean();
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
    const segmentsFilter =
      params.segments && params.segments.length > 0
        ? { segmentSlug: { $in: params.segments } }
        : {};
    const sort: { id: string; desc: boolean } | {} =
      Array.isArray(params.sort) && params.sort.length > 0
        ? params.sort[0]
        : {};

    const teamNameFilter = params.teamName
      ? { teamName: { $regex: params.teamName, $options: "i" } }
      : {};

    const teams = await EventTeam.find({
      eventId: event._id,
      ...statusFilter,
      ...segmentsFilter,
      ...teamNameFilter,
    })
      .sort(
        sort && Object.keys(sort).length > 0 && "id" in sort && "desc" in sort
          ? { [String(sort.id)]: sort.desc === "true" ? -1 : 1 }
          : { createdAt: -1 },
      )
      .select(
        "_id segmentSlug teamName status createdAt isPaidSegment transactionMethod",
      )
      .lean();

    const totalCount = teams.length;
    const paginatedTeams = teams.slice(skip, skip + perPage);

    res
      .status(200)
      .json({ results: paginatedTeams, selectedCount: totalCount });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching teams", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.query.eventSlug,
      segmentSlug: req.query.segmentSlug,
    });
  }
}

// get team by ID
export async function getTeamById(req: Request, res: Response): Promise<void> {
  try {
    const { teamId, eventSlug } = req.params;
    if (!teamId || !eventSlug) {
      res.status(400).json({ message: "Missing team ID or event ID" });
      return;
    }

    const event = await Event.findOne({
      eventSlug: eventSlug,
    })
      .lean()
      .select("_id");
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const teamData = await EventTeam.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(teamId as string),
          eventId: new mongoose.Types.ObjectId(event._id.toString()),
        },
      },
      {
        $lookup: {
          from: "eventregistrations",
          let: {
            memberEmails: "$memberEmails",
            leaderEmail: "$leaderEmail",
            eventId: "$eventId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$email", "$$leaderEmail"] },
                        { $in: ["$email", "$$memberEmails"] },
                      ],
                    },
                    { $eq: ["$eventId", "$$eventId"] },
                  ],
                },
              },
            },
            { $project: { name: 1, status: 1, _id: 1, email: 1, photoUrl: 1 } },
          ],
          as: "allRegistrations",
        },
      },
      {
        $addFields: {
          leaderRegistration: {
            $first: {
              $filter: {
                input: "$allRegistrations",
                as: "reg",
                cond: { $eq: ["$$reg.email", "$leaderEmail"] },
              },
            },
          },
          memberRegistrations: {
            $map: {
              input: "$memberEmails",
              as: "email",
              in: {
                $first: {
                  $filter: {
                    input: "$allRegistrations",
                    as: "reg",
                    cond: { $eq: ["$$reg.email", "$$email"] },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          allRegistrations: 0,
          __v: 0,
          eventId: 0,
        },
      },
    ]);

    if (!teamData || teamData.length === 0) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    res.json({ teamData: teamData[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      teamId: req.params.teamId,
    });
  }
}

// create a new team for a team segment
export async function createSegmentTeam(
  req: Request,
  res: Response,
): Promise<void> {
  const eventSlug = req.params.eventSlug;
  const registrationId = req.user?._id;

  if (!eventSlug || !registrationId) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const body = req.body;

  try {
    const { error: validationError } = teamSchema.validate(body);
    if (validationError) {
      res.status(400).json({ message: validationError.details[0].message });
      return;
    }

    const { segmentSlug, teamName, leaderEmail, memberEmails } = body;

    const event = await Event.findOne({ eventSlug })
      .select("_id segments")
      .lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const segment = event.segments.find((s) => s.segmentSlug === segmentSlug);
    if (!segment) {
      res.status(400).json({ message: "Segment not found in event" });
      return;
    }

    // check if a team already exists for the event and segment
    const existingTeam = await EventTeam.findOne({
      eventId: event._id,
      segmentSlug,
      teamName,
      status: { $in: ["pending", "approved"] },
    });
    if (existingTeam) {
      res.status(400).json({ message: "Team already exists for this segment" });
      return;
    }

    // check if the leader email is already used in another team for the same event and segment
    const existingLeader = await EventTeam.findOne({
      eventId: event._id,
      segmentSlug,
      leaderEmail,
      status: { $in: ["pending", "approved"] },
    });
    if (existingLeader) {
      res.status(400).json({
        message:
          "Leader email is already used in another team for this segment",
      });
      return;
    }

    // check if member emails are registered for the event
    if (memberEmails && memberEmails.length > 0) {
      for (const email of memberEmails) {
        const registration = await EventRegistration.findOne({
          eventId: event._id,
          email: email,
          status: { $in: ["pending", "validated"] },
        }).lean();
        if (!registration) {
          res.status(404).json({
            message: `Registration not found for member email: ${email}`,
          });
          return;
        }
      }
    }

    // check if any member emails or the leader email are already used in another team for the same event and segment
    if (memberEmails && memberEmails.length > 0) {
      const existingMembers = await EventTeam.find({
        eventId: event._id,
        segmentSlug,
        status: { $in: ["pending", "approved"] },
        memberEmails: { $in: [...memberEmails, leaderEmail] },
      });
      if (existingMembers.length > 0) {
        res.status(400).json({
          message:
            "One or more member emails are already used in another team for this segment",
        });
        return;
      }
    }

    // create the team
    const newTeam = await EventTeam.create({
      eventId: event._id,
      segmentSlug,
      isPaidSegment: segment.isPaidSegment,
      transactionMethod: segment.isPaidSegment ? body.transactionMethod : "",
      transactionPhoneNumber: segment.isPaidSegment
        ? body.transactionPhoneNumber
        : "",
      transactionId: segment.isPaidSegment ? body.transactionId : "",
      teamName,
      leaderEmail,
      memberEmails,
    });

    let leaderSegments: string[] = [];

    // add segments to each member's registration and leader's registration
    const allTeamEmails = [leaderEmail, ...(memberEmails || [])];
    for (const email of allTeamEmails) {
      const registration = await EventRegistration.findOne({
        eventId: event._id,
        email: email,
      });

      if (!registration) {
        res
          .status(404)
          .json({ message: `Registration not found for ${email}` });
        return;
      }

      registration.segments.push(segmentSlug);
      await EventRegistration.updateOne(
        { _id: registration._id },
        { segments: registration.segments },
      );

      if (email === leaderEmail) {
        leaderSegments = registration.segments;
      }
    }

    res.status(201).json({
      teamSegment: {
        segmentSlug,
        isPaidSegment: segment.isPaidSegment,
        transactionMethod: segment.isPaidSegment ? body.transactionMethod : "",
        teamName,
        leaderEmail,
        memberEmails,
        status: newTeam.status,
        rejectionReason: newTeam.rejectionReason,
      },
      segments: leaderSegments,
    });
    logger.info("New team created for event segment", {
      teamId: newTeam._id,
      eventId: event._id,
      segmentSlug: segment.segmentSlug,
      teamName,
      leaderEmail,
      creator: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error creating segment team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug: req.params.eventSlug,
      segmentSlug: req.body.segmentSlug,
      creator: req.user?._id,
    });
  }
}

// change the team details for a team segment
export async function updateSegmentTeamStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { teamId, eventSlug } = req.params;
    const { status, rejectionReason } = req.body;
    if (!teamId || !eventSlug || !status) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    const event = await Event.findOne({
      eventSlug: eventSlug,
    }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // check if the team exists
    const team = await EventTeam.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (status) team.status = status;
    if (rejectionReason) team.rejectionReason = rejectionReason;

    let emailSentError = false;
    if (status === "approved") {
      team.rejectionReason = "";

      // if team is approved, update the corresponding event registrations to validated
      const allTeamEmails = [team.leaderEmail, ...(team.memberEmails || [])];
      for (const email of allTeamEmails) {
        const registration = await EventRegistration.findOne({
          eventId: team.eventId,
          email: email,
        }).lean();

        const emailSent = await sendEmail(
          email,
          "Team Approved for Event Segment",
          teamRegistrationConfirmationDraft({
            eventName: event.eventName,
            logoUrl: event.eventLogoUrl,
            name: registration?.name || "Participant",
            segmentName: deSlugify(team.segmentSlug, false),
            teamName: team.teamName,
            leaderEmail: team.leaderEmail,
            memberEmails: team.memberEmails || [],
          }),
        );
        if (!emailSent) {
          emailSentError = true;
        }
      }
    }

    if (status === "rejected") {
      // if team is rejected, update the corresponding event registrations to rejected
      const allTeamEmails = [team.leaderEmail, ...(team.memberEmails || [])];
      for (const email of allTeamEmails) {
        const registration = await EventRegistration.findOne({
          eventId: team.eventId,
          email: email,
        });

        // remove the segment from the registration
        const index = registration?.segments.indexOf(team.segmentSlug);
        if (index !== undefined && index > -1) {
          registration?.segments.splice(index, 1);
        }

        await registration?.save();

        const emailSent = await sendEmail(
          email,
          "Team Rejected for Event Segment",
          teamRegistrationRejectionDraft({
            eventName: event.eventName,
            logoUrl: event.eventLogoUrl,
            segmentName: deSlugify(team.segmentSlug, false),
            teamName: team.teamName,
            leaderEmail: team.leaderEmail,
            memberEmails: team.memberEmails || [],
            rejectionReason: rejectionReason,
          }),
        );
        if (!emailSent) {
          emailSentError = true;
        }
      }
    }

    await team.save();

    res.json({
      message: "Team updated successfully",
      _id: team._id,
      emailSentError,
    });
    logger.info("Team details updated for event segment", {
      teamId: team._id,
      eventId: team.eventId,
      segmentSlug: team.segmentSlug,
      teamName: team.teamName,
      editor: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error updating segment team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      teamId: req.params.teamId,
      editor: req.user?._id,
    });
  }
}

// delete a team for a team segment
export async function deleteSegmentTeam(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { teamId } = req.params;
    if (!teamId) {
      res.status(400).json({ message: "Missing team ID" });
      return;
    }

    // check if the team exists
    const team = await EventTeam.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }
    await EventTeam.findByIdAndDelete(teamId);

    res.json({ message: "Team deleted successfully" });
    logger.info("Team deleted for event segment", {
      eventId: team.eventId,
      segmentSlug: team.segmentSlug,
      teamName: team.teamName,
      leaderEmail: team.leaderEmail,
      deletedBy: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error deleting segment team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      teamId: req.params.teamId,
      deletedBy: req.user?._id,
    });
  }
}
