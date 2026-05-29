import Loader from "@/components/ui/loader/loader";
import capitalize from "@/utils/capitalize";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Activity, useState, type ReactNode } from "react";
import {
  LuCalendar,
  LuEye,
  LuFacebook,
  LuMail,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import DeleteWarning from "@/components/ui/delete-warning";
import { TableBtn } from "@/components/ui/btns";
import ProfilePreview from "../profile-preview";
import { Tooltip } from "@mui/material";
import { getClubPartnerById } from "@/lib/api/event/club-partner";
import type {
  ClubPartnerData,
  ClubPartnerRegistrations,
} from "@/types/event/club-partner-types";
import RegistrationDetailsModel from "../registrations-table/registration-details-model";
import useClubPartnerMutation from "@/hooks/event-hooks/use-club-partner-mutation";
import ChangeClubPartnerStatus from "./change-club-partner-status";

export default function ClubPartnerDetails({
  clubPartnerId,
  previousModels,
  setModelOpen,
}: {
  clubPartnerId: string;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const [loadAllRegistrations, setLoadAllRegistrations] = useState(false);

  const { data: clubPartnerData, isLoading } = useQuery({
    queryKey: [`club-partner-${eventSlug}-${clubPartnerId}`],
    queryFn: () =>
      getClubPartnerById(eventSlug, clubPartnerId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <Loader />
      </div>
    );
  }

  if (!clubPartnerData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <p className="text-gray-600">Club partner details not found.</p>
      </div>
    );
  }

  const details = clubPartnerData.clubPartnerDetails as ClubPartnerData;
  const registrations =
    clubPartnerData.registrations as ClubPartnerRegistrations[];

  return (
    <div className="w-full h-full flex flex-col gap-3 max-md:gap-5">
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={details.clubLogoUrl}
          alt={details.clubName}
          className="w-40 h-40 max-md:w-37 max-md:h-37 rounded-full object-cover object-center"
        />
      </div>
      <Activity mode={window.innerWidth < 768 ? "hidden" : "visible"}>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <StatusTags details={details} />
        </div>
      </Activity>
      <div className="w-full h-full grid grid-cols-2 gap-x-10 gap-y-6 mt-3! max-md:mt-0! max-md:grid-cols-1 max-md:gap-y-5">
        <div className="w-full h-full flex flex-col">
          <Activity mode={window.innerWidth < 768 ? "visible" : "hidden"}>
            <StatusTags details={details} />
          </Activity>
          <h3 className="text-2xl mb-1!">{details.clubName}</h3>
          <div className="flex flex-col gap-px">
            <a
              href={`mailto:${details.clubEmail}`}
              className="w-full text-[0.97rem] flex gap-1 items-center text-highlighted-color transition-all hover:text-highlighted-color/80"
            >
              <LuMail className="opacity-70 text-sm" />
              <span>{details.clubEmail}</span>
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
              <span>{dayjs(details.createdAt).format("DD MMM YYYY")}</span>
            </div>
          </div>
        </div>

        {/* <div>
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
        </div> */}

        <div>
          <h3 className="text-2xl mb-1!">Institution Details:</h3>
          <div className="flex flex-col gap-1"></div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span className="min-w-fit">Institution Name: </span>
            <span className="font-medium ml-1!">{details.institution}</span>
          </div>
          <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
            <span className="min-w-fit">Address: </span>
            <span className="font-medium ml-1!">{details.address}</span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl mb-1!">Moderator Details:</h3>
          <div className="flex flex-col gap-1"></div>
          {details.moderatorName && (
            <>
              <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                <span className="min-w-fit">Moderator Name: </span>
                <span className="font-medium ml-1!">
                  {details.moderatorName}
                </span>
              </div>
              <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                <span className="min-w-fit">Moderator Email: </span>
                <span className="font-medium ml-1!">
                  {details.moderatorEmail}
                </span>
              </div>
              <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                <span className="min-w-fit">Moderator Phone: </span>
                <span className="font-medium ml-1!">
                  {details.moderatorPhoneNumber}
                </span>
              </div>
            </>
          )}
        </div>

        <Activity mode={window.innerWidth < 768 ? "hidden" : "visible"}>
          <RegistrationActions
            details={details}
            clubPartnerId={details._id}
            setModelOpen={setModelOpen}
            version="desktop"
          />
        </Activity>

        <div className="col-span-2 max-md:col-span-1">
          <h3 className="text-2xl mb-1.75!">Registrations:</h3>
          <div className="flex flex-col gap-1"></div>
          {registrations.length == 0 ? (
            <p className="text-gray-600">No registration data available.</p>
          ) : (
            <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-10 max-md:gap-3">
              {[
                ...(loadAllRegistrations
                  ? registrations
                  : registrations.slice(0, 2)),
              ].map((registration: ClubPartnerRegistrations) => {
                return (
                  <div key={registration._id} className="w-full h-full">
                    <ProfilePreview details={registration}>
                      <RegistrationDetailsModel
                        registrationId={registration._id}
                        setOpen={() => {}}
                        className={`bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.registrations.includes(registration._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
                        previousModels={{
                          applications: [
                            ...previousModels.applications,
                            details._id,
                          ],
                          registrations: [...previousModels.registrations],
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
                  </div>
                );
              })}
              {registrations.length > 2 && (
                <button
                  className="primary-button text-[1em]! py-1.75! px-3.5! w-fit! h-fit!"
                  onClick={() => {
                    setLoadAllRegistrations(!loadAllRegistrations);
                  }}
                >
                  {loadAllRegistrations ? "Show Less" : `View All`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusTags({ details }: { details: ClubPartnerData }): ReactNode {
  function getStatusTag(status: "active" | "inactive"): ReactNode {
    let colorClasses = "";
    switch (status) {
      case "active":
        colorClasses = "bg-green-100 text-green-800";
        break;
      case "inactive":
        colorClasses = "bg-red-100 text-red-800";
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-800";
    }
    return (
      <>
        <span
          className={`text-sm py-1! px-2! rounded ${colorClasses} inline-block`}
        >
          {capitalize(status)}
        </span>
        <span
          className={`text-sm py-1! px-2! rounded bg-gray-100 text-gray-900 inline-block`}
        >
          {details.code ? `Code: ${details.code.toUpperCase()}` : "N/A"}
        </span>
        <span
          className={`text-sm py-1! px-2! rounded bg-gray-100 text-gray-900 inline-block`}
        >
          Score: {details.score !== undefined ? details.score : "N/A"}
        </span>
      </>
    );
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">{getStatusTag(details.status)}</div>
    </>
  );
}

function RegistrationActions({
  details,
  clubPartnerId,
  setModelOpen,
  version,
}: {
  details: ClubPartnerData;
  clubPartnerId: string;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  version: "desktop" | "mobile";
}): ReactNode {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const clubPartnerMutation = useClubPartnerMutation();

  return (
    <div>
      <h3 className="text-2xl mb-1.75!">Registration Actions:</h3>
      <div className="flex flex-col gap-1"></div>
      <div className="w-full flex flex-wrap items-center gap-4">
        <ChangeClubPartnerStatus
          id={`change-status-details-${clubPartnerId}-${version}`}
          documentId={clubPartnerId}
          setOpen={() => {}}
          mutation={clubPartnerMutation}
          className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          insideModel={true}
        />
        <div>
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
              clubPartnerMutation.mutate({
                method: "delete",
                clubPartnerId: details._id,
              });
              setModelOpen(false);
            }}
            open={deleteOpen}
            setOpen={setDeleteOpen}
            title="Delete Club Partner"
          >
            This will permanently delete this club partner{" "}
            <span className="font-semibold">{details.clubName}</span> from the
            club partners' list and remove all of their data from the server.
            All of their images, links, and other data will be permanently lost.
          </DeleteWarning>
        </div>
      </div>
    </div>
  );
}
