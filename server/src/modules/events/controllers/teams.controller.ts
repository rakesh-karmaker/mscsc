import { Request, Response } from "express";
import EventTeam from "../models/event-team.model.js";
import mongoose from "mongoose";

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
    console.error("Error getting teams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// get team by ID
export async function getTeamById(req: Request, res: Response): Promise<void> {
  try {
    const { teamId } = req.params;
    if (!teamId) {
      res.status(400).json({ message: "Missing team ID" });
      return;
    }

    // get the team along with the event name form the events collection and the leader and members' details from the event registrations collection
    const team = await EventTeam.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(teamId) },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "eventregistrations",
          let: {
            leaderEmail: "$leaderEmail",
            memberEmails: "$memberEmails",
            eventId: "$eventId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$eventId", "$$eventId"] },
                    {
                      $or: [
                        { $eq: ["$email", "$$leaderEmail"] },
                        { $in: ["$email", "$$memberEmails"] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                isLeader: { $eq: ["$email", "$$leaderEmail"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                photoUrl: 1,
                phoneNumber: 1,
                facebookUrl: 1,
                institution: 1,
                grade: 1,
                registrationDate: 1,
                code: 1,
                isLeader: 1,
              },
            },
          ],
          as: "members",
        },

        $project: {
          _id: 1,
          eventId: 1,
          segmentSlug: 1,
          teamName: 1,
          leaderEmail: 1,
          memberEmails: 1,
          status: 1,
          eventName: "$event.name",
          members: 1,
        },
      },
    ]);
    if (!team || team.length === 0) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    res.json({ team: team[0] });
  } catch (error) {
    console.error("Error getting team by ID:", error);
    res.status(500).json({ message: "Internal server error" });
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
  } catch (error) {
    console.error("Error creating segment team:", error);
    res.status(500).json({ message: "Internal server error" });
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
        eventId: team.eventId,
        segmentSlug: team.segmentSlug,
        memberEmails: {
          $in: [...memberEmails, leaderEmail || team.leaderEmail],
        },
      });
      if (existingMembers.length > 0) {
        res.status(400).json({
          message:
            "One or more member emails are already used in another team for this segment",
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
  } catch (error) {
    console.error("Error updating segment team:", error);
    res.status(500).json({ message: "Internal server error" });
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

    console.log(
      `${req.user?._id} Deleted team with ID ${teamId} for event ${team.eventId} and segment ${team.segmentSlug}`,
    );

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting segment team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
