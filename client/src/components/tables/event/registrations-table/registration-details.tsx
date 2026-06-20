import Loader from "@/components/ui/loader/loader";
import { getRegistrationById } from "@/lib/api/event/event-registrations";
import type {
  CaPreviewData,
  EventRegistrationDetails,
  PaidSoloSegment,
} from "@/types/event/event-registration-types";
import capitalize from "@/utils/capitalize";
import { deSlugify } from "@/utils/de-slugify";
import getCategory from "@/utils/get-category";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Activity, type ReactNode } from "react";
import LuCalendar from "~icons/lucide/calendar";
import LuEye from "~icons/lucide/eye";
import LuFacebook from "~icons/lucide/facebook";
import LuMail from "~icons/lucide/mail";
import LuPhone from "~icons/lucide/phone";
import { useParams } from "react-router-dom";
import TeamDetailsModel from "../teams-table/team-details-model";
import ProfilePreview from "../profile-preview";
import type { EventTeamPreviewData } from "@/types/event/event-team-types";
import ApplicationDetailsModel from "../ca-table/application-details-model";
import { Tooltip } from "@mui/material";
import RegistrationActions from "./registration-actions";
import { RegistrationStatusTags, TeamStatusTag } from "@/utils/get-status-tags";
import SoloPaidSegment from "./solo-paid-segment";

export default function RegistrationDetails({
  registrationId,
  previousModels,
  setModelOpen,
}: {
  registrationId: string;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const { data: registrationData, isLoading } = useQuery({
    queryKey: [`registration-${eventSlug}-${registrationId}`],
    queryFn: () =>
      getRegistrationById(eventSlug, registrationId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <Loader />
      </div>
    );
  }

  if (!registrationData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <p className="text-gray-600">Registration details not found.</p>
      </div>
    );
  }

  const details =
    registrationData.registrationDetails as EventRegistrationDetails;
  const teamData = registrationData.teamData as EventTeamPreviewData[];
  const caData = registrationData.caData as CaPreviewData | null;

  return (
    <div className="w-full h-full flex flex-col gap-3 max-md:gap-5">
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={details.photoUrl}
          alt={details.name}
          className="w-40 h-40 max-md:w-37 max-md:h-37 rounded-full object-cover object-center"
        />
      </div>
      <Activity mode={window.innerWidth < 768 ? "hidden" : "visible"}>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <RegistrationStatusTags details={details} />
        </div>
      </Activity>
      <div className="w-full h-full grid grid-cols-2 gap-x-10 gap-y-6 mt-3! max-md:mt-0! max-md:grid-cols-1 max-md:gap-y-5">
        <div className="w-full h-full flex flex-col">
          <Activity mode={window.innerWidth < 768 ? "visible" : "hidden"}>
            <RegistrationStatusTags details={details} />
          </Activity>
          <h3 className="text-2xl mb-1!">{details.name}</h3>
          <div className="flex flex-col gap-px">
            <a
              href={`mailto:${details.email}`}
              className="w-fit text-[0.97rem] flex gap-1 items-center text-highlighted-color transition-all hover:text-highlighted-color/80"
            >
              <LuMail className="opacity-70 text-sm" />
              <span>{details.email}</span>
            </a>
            <a
              href={`${details.facebookUrl}`}
              className="w-fit text-[0.97rem] flex gap-1 items-center text-highlighted-color transition-all hover:text-highlighted-color/80"
            >
              <LuFacebook className="opacity-70 text-sm" />
              <span>Facebook</span>
            </a>

            <div className="w-full text-[0.97rem] flex gap-1 items-center text-gray-700">
              <LuPhone className="opacity-70 text-sm" />
              <span>{details.phoneNumber}</span>
            </div>

            <div className="w-full text-[0.97rem] flex gap-1 items-center text-gray-700">
              <LuCalendar className="opacity-70 text-sm" />
              <span>
                {dayjs(details.registrationDate).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl mb-1!">Transaction Details:</h3>
          <div className="flex flex-col gap-1"></div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span>Transaction Method: </span>
            <span className="font-medium ml-1!">
              {capitalize(details.transactionMethod)}
            </span>
          </div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span>Phone Number: </span>
            <span className="font-medium ml-1!">
              {details.transactionPhoneNumber}
            </span>
          </div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span>Transaction ID: </span>
            <span className="font-medium ml-1!">{details.transactionId}</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl mb-1!">Institution Details:</h3>
          <div className="flex flex-col gap-1"></div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span className="min-w-fit">Institution Name: </span>
            <span className="font-medium ml-1!">{details.institution}</span>
          </div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span className="min-w-fit">Grade: </span>
            <span className="font-medium ml-1!">{details.grade}</span>
          </div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span className="min-w-fit">Category: </span>
            <span className="font-medium ml-1!">
              {getCategory(details.grade)}
            </span>
          </div>
        </div>
        <Activity mode={window.innerWidth < 768 ? "hidden" : "visible"}>
          <RegistrationActions
            details={details}
            registrationId={registrationId}
            setModelOpen={setModelOpen}
            version="desktop"
          />
        </Activity>

        <div className="col-span-2 max-md:col-span-1">
          <h3 className="text-2xl mb-1.75!">Segments:</h3>
          <div className="flex flex-col gap-1"></div>
          <div className="w-full flex flex-wrap gap-2">
            {details.segments &&
              details.segments.map((segment: string) => (
                <p
                  className="min-w-fit py-0.75! px-1.5! text-sm bg-gray-100  rounded-md"
                  key={segment}
                >
                  {deSlugify(segment, false)}
                </p>
              ))}
          </div>
        </div>

        {details.paidSoloSegments && (
          <div className="col-span-2 max-md:col-span-1">
            <h3 className="text-2xl mb-1.75!">Paid Solo Segments:</h3>
            <div className="flex flex-col gap-1"></div>
            {details.paidSoloSegments.length == 0 ? (
              <p className="text-gray-600 ml-2!">
                No paid solo segments available for this registration.
              </p>
            ) : (
              <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-10 max-md:gap-3">
                {details.paidSoloSegments.map((segment: PaidSoloSegment) => {
                  return (
                    <SoloPaidSegment
                      key={segment.segmentSlug}
                      segment={segment}
                      registrationId={registrationId}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="col-span-2 max-md:col-span-1">
          <h3 className="text-2xl mb-1.75!">Team Details:</h3>
          <div className="flex flex-col gap-1"></div>
          {teamData.length == 0 ? (
            <p className="text-gray-600">
              No team data available for this registration.
            </p>
          ) : (
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-10 max-md:gap-3">
              {teamData.map((team: EventTeamPreviewData) => {
                return (
                  <div key={team._id} className="w-full h-full">
                    <h4 className="text-lg mb-0.5! flex flex-wrap gap-1 [&>span]:text-xs">
                      {team.teamName}{" "}
                      <TeamStatusTag details={team} isPreview={true} />
                    </h4>
                    <div className="ml-2!">
                      <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                        <span className="min-w-fit">Segment: </span>
                        <span className="font-medium ml-1!">
                          {deSlugify(team.segmentSlug, false)}
                        </span>
                      </div>
                      <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                        <span className="min-w-fit">Leader: </span>
                        <span className="font-medium ml-1!">
                          {team.leaderEmail}
                        </span>
                      </div>
                      <div className="w-full text-[0.97rem] flex text-gray-700">
                        <span className="min-w-fit">Members: </span>
                        <span className="font-medium ml-1!">
                          {team.memberEmails.length}
                        </span>
                      </div>
                    </div>
                    <TeamDetailsModel
                      teamId={team._id}
                      setOpen={() => {}}
                      className={`ml-2! max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.teams.includes(team._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
                      previousModels={{
                        applications: previousModels.applications,
                        registrations: previousModels.registrations,
                        teams: [...previousModels.teams, team._id],
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="col-span-2">
          <h3 className="text-2xl mb-1!">Additional Info:</h3>
          <div className="flex flex-col gap-1"></div>
          {caData ? (
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-10 max-md:gap-3">
              <div className="w-full h-full">
                <h4 className="text-lg mb-0.5!">Reference</h4>
                <div className="ml-2!">
                  <ProfilePreview details={caData}>
                    <ApplicationDetailsModel
                      applicationId={caData._id}
                      setOpen={() => {}}
                      className={`bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.applications.includes(caData._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
                      previousModels={{
                        applications: [
                          ...previousModels.applications,
                          caData._id,
                        ],
                        registrations: previousModels.registrations,
                        teams: previousModels.teams,
                      }}
                    >
                      <Tooltip
                        title="View Registration Details"
                        placement="top"
                        arrow
                      >
                        <LuEye className="w-5 h-5" />
                      </Tooltip>
                    </ApplicationDetailsModel>
                  </ProfilePreview>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
              <span className="min-w-fit">Reference: </span>
              <span className="font-medium ml-1!">{details.reference}</span>
            </div>
          )}
          {details.clubReference ? (
            <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700 mt-2!">
              <span className="min-w-fit">Club Reference: </span>
              <span className="font-medium ml-1!">{details.clubReference}</span>
            </div>
          ) : null}
        </div>

        <Activity mode={window.innerWidth < 768 ? "visible" : "hidden"}>
          <RegistrationActions
            details={details}
            registrationId={registrationId}
            setModelOpen={setModelOpen}
            version="mobile"
          />
        </Activity>
      </div>
    </div>
  );
}
