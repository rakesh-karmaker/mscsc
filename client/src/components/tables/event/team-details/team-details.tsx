import Loader from "@/components/ui/loader/loader";
import type { EventRegistrationDetails } from "@/types/event/event-registration-types";
import capitalize from "@/utils/capitalize";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { LuCircleX, LuEye } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { getTeamById } from "@/lib/api/event/event-teams";
import { Tooltip } from "@mui/material";
import { deSlugify } from "@/utils/de-slugify";
import TeamEditModel from "./team-edit-model";
import ProfilePreview from "../profile-preview";
import RegistrationDetailsModel from "../registrations-table/registration-details-model";
import type { EventTeamData } from "@/types/event/event-team-types";

export default function TeamDetails({
  teamId,
  previousModels,
  setDetailsModelOpen,
}: {
  teamId: string;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
  setDetailsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const { data, isLoading } = useQuery({
    queryKey: [`team-${eventSlug}-${teamId}`],
    queryFn: () => getTeamById(eventSlug, teamId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <p className="text-gray-600">Team details not found.</p>
      </div>
    );
  }

  const teamData = data.teamData as EventTeamData;

  function getStatusTag(
    status: "registering" | "pending" | "approved",
  ): ReactNode {
    let colorClasses = "";
    switch (status) {
      case "registering":
        colorClasses = "bg-blue-100 text-blue-800";
        break;
      case "pending":
        colorClasses = "bg-yellow-100 text-yellow-800";
        break;
      case "approved":
        colorClasses = "bg-green-100 text-green-800";
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-800";
    }
    return (
      <span
        className={`text-sm py-1! px-2! rounded ${colorClasses} inline-block`}
      >
        {capitalize(status)}
      </span>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div>
        <h3 className="text-3xl">{teamData.teamName}</h3>
        <p className="text-base mb-0.5! text-gray-600">
          {deSlugify(teamData.segmentSlug, false)}
        </p>
        <div className="w-full h-full flex flex-wrap gap-1">
          {getStatusTag(teamData.status)}
        </div>
      </div>
      <div className="flex flex-col gap-1"></div>

      <div>
        <h3 className="text-xl mb-1!">Team Leader:</h3>
        <div className="flex flex-col gap-1"></div>
        {teamData.leaderRegistration ? (
          <ProfilePreview details={teamData.leaderRegistration}>
            <RegistrationDetailsModel
              registrationId={teamData.leaderRegistration._id}
              setOpen={() => {}}
              className={`bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.registrations.includes(teamData.leaderRegistration._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
              previousModels={{
                applications: previousModels.applications,
                registrations: [
                  ...previousModels.registrations,
                  teamData.leaderRegistration._id,
                ],
                teams: previousModels.teams,
              }}
            >
              <Tooltip title="View Registration Details" placement="top" arrow>
                <div className="max-xs:flex gap-2 items-center">
                  <LuEye className="w-5 h-5" />
                  <p className="xs:hidden">View Details</p>
                </div>
              </Tooltip>
            </RegistrationDetailsModel>
          </ProfilePreview>
        ) : (
          <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
            <span className="min-w-fit">Email: </span>
            <span className="font-medium">{teamData.leaderEmail}</span>
            <Tooltip
              title="No registration found for this leader. This means the leader has not registered for the event using this email or their registration is not linked to the team for some reason."
              placement="top"
              arrow
            >
              <div className="bg-red-100 text-red-800 text-base p-1! rounded-full">
                <LuCircleX className="opacity-70" />
              </div>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="mt-2!">
        <h3 className="text-xl mb-1!">Team Members:</h3>
        <div className="flex flex-col gap-1"></div>
        {teamData.memberEmails.length > 0 ? (
          <div className="flex flex-col gap-2">
            {teamData.memberEmails.map((memberEmail: string, index: number) => {
              const memberData = teamData.memberRegistrations.find(
                (
                  reg: Pick<
                    EventRegistrationDetails,
                    "_id" | "name" | "email" | "status" | "photoUrl"
                  > | null,
                ) => reg?.email === memberEmail,
              );

              return memberData ? (
                <ProfilePreview details={memberData} key={index}>
                  <RegistrationDetailsModel
                    registrationId={memberData._id}
                    setOpen={() => {}}
                    className={`bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.registrations.includes(memberData._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
                    previousModels={{
                      applications: previousModels.applications,
                      registrations: [
                        ...previousModels.registrations,
                        memberData._id,
                      ],
                      teams: previousModels.teams,
                    }}
                  >
                    <Tooltip
                      title="View Registration Details"
                      placement="top"
                      arrow
                    >
                      <div className="max-xs:flex gap-2 items-center">
                        <LuEye className="w-5 h-5" />
                        <p className="xs:hidden">View Details</p>
                      </div>
                    </Tooltip>
                  </RegistrationDetailsModel>
                </ProfilePreview>
              ) : (
                <div
                  key={index}
                  className="w-full text-[0.97rem] flex gap-1 text-gray-700"
                >
                  <span className="min-w-fit">Email: </span>
                  <span className="font-medium">{memberEmail}</span>
                  <Tooltip
                    title="No registration found for this member. This means the member has not registered for the event using this email or their registration is not linked to the team for some reason."
                    placement="top"
                    arrow
                  >
                    <div className="bg-red-100 text-red-800 text-base p-1! rounded-full">
                      <LuCircleX className="opacity-70" />
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No members added to the team.</p>
        )}
      </div>

      <div className="mt-2!">
        <h3 className="text-xl mb-1!">Actions:</h3>
        <div className="flex flex-col gap-1"></div>
        <TeamEditModel
          teamData={teamData}
          setDetailsModelOpen={setDetailsModelOpen}
        />
      </div>
    </div>
  );
}
