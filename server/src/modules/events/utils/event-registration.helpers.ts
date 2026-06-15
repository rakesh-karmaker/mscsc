import { TeamSegmentData } from "../event.types.js";
import { deSlugify } from "./de-slugify.js";
import EventTeam from "../models/event-team.model.js";
// import EventRegistration from "../models/event-registration.model.js";

export function normalizeEmail(value: unknown): string {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function normalizeTeamSegmentData(rawData: unknown): TeamSegmentData {
  return {
    teamName: String((rawData as any)?.teamName || "").trim(),
    leaderEmail: normalizeEmail((rawData as any)?.leaderEmail),
    memberEmails: Array.isArray((rawData as any)?.memberEmails)
      ? ((rawData as any).memberEmails as unknown[])
          .map(normalizeEmail)
          .filter(Boolean)
      : [],
  };
}

export function normalizeTeamSegmentsData(
  rawValue: unknown,
): Record<string, TeamSegmentData> | undefined {
  if (!rawValue || typeof rawValue !== "object") {
    return undefined;
  }

  return Object.entries(rawValue).reduce(
    (acc, [segmentSlug, segmentValue]) => {
      acc[segmentSlug] = normalizeTeamSegmentData(segmentValue);
      return acc;
    },
    {} as Record<string, TeamSegmentData>,
  );
}

export async function validateTeamSegmentsData(
  eventId: string,
  userEmail: string,
  teamSegmentsData: Record<string, TeamSegmentData>,
): Promise<{ message: string; segmentSlug: string } | null> {
  for (const [segmentSlug, teamData] of Object.entries(teamSegmentsData)) {
    if (!teamData.teamName || !teamData.leaderEmail) {
      return {
        segmentSlug,
        message: `Invalid team data provided for segment - ${deSlugify(
          segmentSlug,
          false,
        )}`,
      };
    }

    if (teamData.memberEmails.includes(teamData.leaderEmail)) {
      return {
        segmentSlug,
        message: `Leader email cannot be listed as a member email for the ${deSlugify(
          segmentSlug,
          false,
        )} segment. Please check your team information.`,
      };
    }

    const isLeader = teamData.leaderEmail === userEmail;
    const sharedQuery: {
      eventId: string;
      segmentSlug: string;
      teamName: string;
    } = {
      eventId,
      segmentSlug,
      teamName: teamData.teamName,
    };

    if (isLeader) {
      const existingTeam = await EventTeam.findOne({
        ...sharedQuery,
        leaderEmail: { $ne: teamData.leaderEmail },
      });
      if (existingTeam) {
        return {
          message: `The team name "${teamData.teamName}" is already taken for the ${deSlugify(
            segmentSlug,
            false,
          )} segment. Please choose a different name.`,
          segmentSlug,
        };
      }

      if (teamData.memberEmails.length > 0) {
        const conflictingTeams = await EventTeam.find({
          eventId,
          segmentSlug,
          $or: [
            { leaderEmail: { $in: teamData.memberEmails } },
            { memberEmails: { $in: teamData.memberEmails } },
          ],
        });

        if (conflictingTeams.length > 0) {
          return {
            segmentSlug,
            message: `One or more member emails are already associated with a team in the ${deSlugify(
              segmentSlug,
              false,
            )} segment. Please check your team information.`,
          };
        }
      }
    } else {
      const existingTeam = await EventTeam.findOne({
        ...sharedQuery,
        leaderEmail: teamData.leaderEmail,
      });
      if (!existingTeam) {
        return {
          segmentSlug,
          message: `No team found for the ${deSlugify(
            segmentSlug,
            false,
          )} segment with the provided leader email ${teamData.leaderEmail} and team name ${teamData.teamName}. Please check your team information.`,
        };
      }

      if (!existingTeam.memberEmails?.includes(userEmail)) {
        return {
          segmentSlug,
          message: `You are not listed as a member of the team for the ${deSlugify(
            segmentSlug,
            false,
          )} segment. Please check your team information and your email.`,
        };
      }
    }
  }

  return null;
}

// export async function createOrUpdateEventTeams(
//   eventId: unknown,
//   userEmail: string,
//   teamSegmentsData: Record<string, TeamSegmentData>,
// ): Promise<void> {
//   for (const [segmentSlug, teamData] of Object.entries(teamSegmentsData)) {
//     const isLeader = teamData.leaderEmail === userEmail;

//     if (isLeader) {
//       let status: "registering" | "pending" | "approved" = "registering";
//       if (teamData.memberEmails.length > 0) {
//         const members = await EventRegistration.find({
//           eventId,
//           email: { $in: teamData.memberEmails },
//         });
//         if (members.length === teamData.memberEmails.length) {
//           status = "pending";
//         }
//       }

//       await EventTeam.create({
//         eventId,
//         segmentSlug,
//         teamName: teamData.teamName,
//         leaderEmail: teamData.leaderEmail,
//         memberEmails: teamData.memberEmails,
//         status,
//       });
//     } else {
//       const members = await EventRegistration.find({
//         eventId,
//         $or: [
//           { email: teamData.leaderEmail },
//           { email: { $in: teamData.memberEmails } },
//         ],
//       });
//       if (members.length === teamData.memberEmails.length + 1) {
//         await EventTeam.findOneAndUpdate(
//           {
//             eventId,
//             segmentSlug,
//             teamName: teamData.teamName,
//             leaderEmail: teamData.leaderEmail,
//           },
//           { status: "pending" },
//         );
//       }
//     }
//   }
// }
