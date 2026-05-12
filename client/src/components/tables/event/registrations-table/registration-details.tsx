import Loader from "@/components/ui/loader/loader";
import { getRegistrationById } from "@/lib/api/event/event-registrations";
import type {
  EventRegistrationDetails,
  EventTeamPreviewData,
} from "@/types/event-types";
import capitalize from "@/utils/capitalize";
import { deSlugify } from "@/utils/de-slugify";
import getCategory from "@/utils/get-category";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState, type ReactNode } from "react";
import {
  LuCalendar,
  LuFacebook,
  LuMail,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import TeamDetailsModel from "../team-details/team-details-model";
import ChangeStatus from "./change-status";
import DeleteWarning from "@/components/ui/delete-warning";
import { TableBtn } from "@/components/ui/btns";

export default function RegistrationDetails({
  registrationId,
  previousModels,
  registrationMutation,
  setModelOpen,
}: {
  registrationId: string;
  previousModels: {
    registrations: string[];
    teams: string[];
  };
  registrationMutation: any;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode {
  const eventSlug = useParams().eventSlug!;
  const [deleteOpen, setDeleteOpen] = useState(false);

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

  function getStatusTag(
    status: "pending" | "validated" | "rejected",
  ): ReactNode {
    let colorClasses = "";
    switch (status) {
      case "pending":
        colorClasses = "bg-yellow-100 text-yellow-800";
        break;
      case "validated":
        colorClasses = "bg-green-100 text-green-800";
        break;
      case "rejected":
        colorClasses = "bg-red-100 text-red-800";
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
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={details.photoUrl}
          alt={details.name}
          className="w-27 h-27 rounded-full object-cover object-center"
        />
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="flex gap-2 flex-wrap">
          <span
            className={`px-2! py-1! rounded-xs text-xs font-medium ${
              details.hasAttended
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {details.hasAttended ? "Attended" : "Not Attended"}
          </span>
          {getStatusTag(details.status)}
        </div>
        {details.status === "rejected" && details.rejectionReason && (
          <div className="w-full bg-red-50 border border-red-200 text-red-800 text-sm p-3! rounded mt-2!">
            <h4 className="font-medium mb-1!">Rejection Reason:</h4>
            <p>{details.rejectionReason}</p>
          </div>
        )}
        <h3 className="text-2xl mb-1!">{details.name}</h3>
        <div className="flex flex-col gap-px">
          <a
            href={`mailto:${details.email}`}
            className="w-full text-[0.97rem] flex gap-1 items-center text-highlighted-color transition-all hover:text-highlighted-color/80"
          >
            <LuMail className="opacity-70 text-sm" />
            <span>{details.email}</span>
          </a>
          <a
            href={`${details.facebookUrl}`}
            className="w-full text-[0.97rem] flex gap-1 items-center text-highlighted-color transition-all hover:text-highlighted-color/80"
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
            <span>{dayjs(details.registrationDate).format("DD MMM YYYY")}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-2xl mb-1!">Transaction Details:</h3>
        <div className="flex flex-col gap-1"></div>
        <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
          <span>Transaction Method: </span>
          <span className="font-medium">
            {capitalize(details.transactionMethod)}
          </span>
        </div>
        <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
          <span>Phone Number: </span>
          <span className="font-medium">{details.transactionPhoneNumber}</span>
        </div>
        <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
          <span>Transaction ID: </span>
          <span className="font-medium">{details.transactionId}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl mb-1!">Institution Details:</h3>
        <div className="flex flex-col gap-1"></div>
        <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
          <span className="min-w-fit">Institution Name: </span>
          <span className="font-medium">{details.institution}</span>
        </div>
        <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
          <span className="min-w-fit">Grade: </span>
          <span className="font-medium">{details.grade}</span>
        </div>
        <div>
          <span className="min-w-fit">Category: </span>
          <span className="font-medium">{getCategory(details.grade)}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl mb-1.75!">Segments:</h3>
        <div className="flex flex-col gap-1"></div>
        <div className="w-full flex flex-wrap gap-2">
          {details.segments &&
            details.segments.map((segment: string) => (
              <p
                className="min-w-fit py-0.75! px-1.5! text-sm bg-gray-100  rounded-md"
                key={segment}
              >
                {segment}
              </p>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl mb-1.75!">Team Details:</h3>
        <div className="flex flex-col gap-1"></div>
        {teamData.length == 0 ? (
          <p className="text-gray-600">
            No team data available for this registration.
          </p>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {teamData.map((team: EventTeamPreviewData) => {
              return (
                <div key={team._id}>
                  <h4 className="text-lg mb-0.5!">{team.teamName}</h4>
                  <div className="ml-2!">
                    <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
                      <span className="min-w-fit">Segment: </span>
                      <span className="font-medium">
                        {deSlugify(team.segmentSlug, false)}
                      </span>
                    </div>
                    <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
                      <span className="min-w-fit">Leader: </span>
                      <span className="font-medium">{team.leaderEmail}</span>
                    </div>
                    <div className="w-full text-[0.97rem] flex gap-1 text-gray-700">
                      <span className="min-w-fit">Members: </span>
                      <span className="font-medium">
                        {team.memberEmails.length}
                      </span>
                    </div>
                  </div>
                  <TeamDetailsModel
                    teamId={team._id}
                    setOpen={() => {}}
                    className={`ml-2! max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.teams.includes(team._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
                    previousModels={{
                      registrations: previousModels.registrations,
                      teams: [...previousModels.teams, team._id],
                    }}
                    registrationMutation={registrationMutation}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl mb-1.75!">Registration Actions:</h3>
        <div className="flex flex-col gap-1"></div>
        <div className="w-full flex items-center gap-4">
          <ChangeStatus
            id={`change-status-details-${registrationId}`}
            registrationId={registrationId}
            setOpen={() => {}}
            registrationMutation={registrationMutation}
            className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
            insideModel={true}
          />
          <div className="border-t border-gray-300">
            <TableBtn
              className="max-w-fit bg-red-500 text-white hover:bg-secondary-bg/20 border hover:text-black border-red-500/20 transition-all duration-200"
              aria-label="Delete this data"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDeleteOpen(true);
              }}
            >
              <LuTrash2 className="opacity-70" />
              <p>Delete </p>
            </TableBtn>
            <DeleteWarning
              slug={details._id}
              deleteFunc={() => {
                registrationMutation.mutate({
                  method: "delete",
                  registrationId: details._id,
                });
                setModelOpen(false);
              }}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Delete Registration"
            >
              This will permanently delete this registration{" "}
              <span className="font-semibold">{details.name}</span> from the
              registration's list and remove all of their data from the server.
              All of their images, links, and other data will be permanently
              lost.
            </DeleteWarning>
          </div>
        </div>
      </div>
    </div>
  );
}
