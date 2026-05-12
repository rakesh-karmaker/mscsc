import { Request, Response } from "express";
import mongoose from "mongoose";
import EventTeam from "../models/event-team.model.js";
import Event from "../models/event.model.js";
import { logEvent } from "../../../shared/utils/log-event.js";

// get all teams
export async function getAllTeams(req: Request, res: Response): Promise<void> {
  try {
    const { eventId, segmentSlug } = req.query;
    if (!eventId || !segmentSlug) {
      res.status(400).json({ message: "Missing eventId or segmentSlug" });
      return;
    }

    const teams = await EventTeam.find({
      eventId,
      segmentSlug,
    });

    res.json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    await logEvent("error", "Error fetching teams", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventId: req.query.eventId,
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
          _id: new mongoose.Types.ObjectId(teamId),
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
    await logEvent("error", "Error fetching team", {
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
  try {
    const { eventId, segmentSlug, teamName, leaderEmail, memberEmails } =
      req.body;

    if (!eventId || !segmentSlug || !teamName || !leaderEmail) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // check if a team already exists for the event and segment
    const existingTeam = await EventTeam.findOne({
      eventId,
      segmentSlug,
      teamName,
    });
    if (existingTeam) {
      res.status(400).json({ message: "Team already exists for this segment" });
      return;
    }

    // check if the leader email is already used in another team for the same event and segment
    const existingLeader = await EventTeam.findOne({
      eventId,
      segmentSlug,
      leaderEmail,
    });
    if (existingLeader) {
      res.status(400).json({
        message:
          "Leader email is already used in another team for this segment",
      });
      return;
    }

    // check if any member emails or the leader email are already used in another team for the same event and segment
    if (memberEmails && memberEmails.length > 0) {
      const existingMembers = await EventTeam.find({
        eventId,
        segmentSlug,
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
    const newTeam = new EventTeam({
      eventId,
      segmentSlug,
      teamName,
      leaderEmail,
      memberEmails: memberEmails || [],
      status: "registering",
    });
    await newTeam.save();

    res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
    await logEvent("info", "New team created manually for event segment", {
      teamId: newTeam._id,
      eventId,
      segmentSlug,
      teamName,
      leaderEmail,
      creator: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    await logEvent("error", "Error creating segment team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventId: req.body.eventId,
      segmentSlug: req.body.segmentSlug,
      creator: req.user?._id,
    });
  }
}

// change the team details for a team segment
export async function updateSegmentTeam(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { teamId } = req.params;
    const { teamName, leaderEmail, memberEmails, status } = req.body;
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

    // check if new team name is already used by another team for the same event and segment
    if (teamName && teamName !== team.teamName) {
      const existingTeam = await EventTeam.findOne({
        eventId: team.eventId,
        segmentSlug: team.segmentSlug,
        teamName,
      });
      if (existingTeam) {
        res
          .status(400)
          .json({ message: "Team name is already used for this segment" });
        return;
      }
    }

    // check if new leader email is already used in another team for the same event and segment
    if (leaderEmail && leaderEmail !== team.leaderEmail) {
      const existingLeader = await EventTeam.findOne({
        eventId: team.eventId,
        segmentSlug: team.segmentSlug,
        leaderEmail,
      });
      if (existingLeader) {
        res.status(400).json({
          message:
            "Leader email is already used in another team for this segment",
        });
        return;
      }
    }

    // check if any new member emails or the new leader email are already used in another team for the same event and segment
    if (memberEmails && memberEmails.length > 0) {
      const existingMembers = await EventTeam.find({
        _id: { $ne: teamId },
        eventId: team.eventId,
        segmentSlug: team.segmentSlug,
        memberEmails: {
          $in: [...memberEmails, leaderEmail || team.leaderEmail],
        },
      });
      if (existingMembers.length > 0) {
        console.log("Existing members found:", existingMembers);
        res.status(400).json({
          message:
            "One or more member emails are already used in another team for this segment",
        });
        return;
      }
      if (leaderEmail && memberEmails.includes(leaderEmail)) {
        res.status(400).json({
          message: "Leader email cannot be included in member emails",
        });
        return;
      }
    }

    // update the team details
    if (teamName) team.teamName = teamName;
    if (leaderEmail) team.leaderEmail = leaderEmail;
    if (memberEmails) team.memberEmails = memberEmails;
    if (status) team.status = status;

    await team.save();

    res.json({ message: "Team updated successfully", team });
    await logEvent("info", "Team details updated for event segment", {
      teamId: team._id,
      eventId: team.eventId,
      segmentSlug: team.segmentSlug,
      teamName: team.teamName,
      editor: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    await logEvent("error", "Error updating segment team", {
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
    await logEvent("info", "Team deleted for event segment", {
      eventId: team.eventId,
      segmentSlug: team.segmentSlug,
      teamName: team.teamName,
      leaderEmail: team.leaderEmail,
      deletedBy: req.user?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    await logEvent("error", "Error deleting segment team", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      teamId: req.params.teamId,
      deletedBy: req.user?._id,
    });
  }
}
