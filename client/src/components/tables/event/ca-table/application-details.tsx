import Loader from "@/components/ui/loader/loader";
import capitalize from "@/utils/capitalize";
import getCategory from "@/utils/get-category";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Activity, useState, type ReactNode } from "react";
import {
  LuCalendar,
  LuEye,
  LuFacebook,
  LuHouse,
  LuMail,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import ChangeStatus from "../change-status";
import DeleteWarning from "@/components/ui/delete-warning";
import { TableBtn } from "@/components/ui/btns";
import ProfilePreview from "../profile-preview";
import { getCaApplicationById } from "@/lib/api/event/ca-applications";
import type {
  CaApplicationDetails,
  RegistrationUsingCACode,
} from "@/types/event/ca-types";
import RegistrationDetailsModel from "../registrations-table/registration-details-model";
import { Tooltip } from "@mui/material";
import useCaApplicationMutation from "@/hooks/event-hooks/use-ca-application-mutation";
import CaCodeModel from "./ca-code-model";
import { IoMdFemale, IoMdMale } from "react-icons/io";

export default function ApplicationDetails({
  applicationId,
  previousModels,
  setModelOpen,
}: {
  applicationId: string;
  previousModels: {
    applications: string[];
    registrations: string[];
    teams: string[];
  };
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const [loadAllRegistrations, setLoadAllRegistrations] = useState(false);

  const { data: applicationData, isLoading } = useQuery({
    queryKey: [`application-${eventSlug}-${applicationId}`],
    queryFn: () =>
      getCaApplicationById(eventSlug, applicationId).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <Loader />
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <p className="text-gray-600">Application details not found.</p>
      </div>
    );
  }

  const details = applicationData.applicationDetails as CaApplicationDetails;
  const registrations =
    applicationData.registrationsUsingCACode as RegistrationUsingCACode[];

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
          <StatusTags details={details} />
        </div>
      </Activity>
      <div className="w-full h-full grid grid-cols-2 gap-x-10 gap-y-6 mt-3! max-md:mt-0! max-md:grid-cols-1 max-md:gap-y-5">
        <div className="w-full h-full flex flex-col">
          <Activity mode={window.innerWidth < 768 ? "visible" : "hidden"}>
            <StatusTags details={details} />
          </Activity>
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
              {details.gender == "male" ? (
                <IoMdMale className="opacity-70 text-sm" />
              ) : (
                <IoMdFemale className="opacity-70 text-sm" />
              )}
              <span>{details.gender == "male" ? "Male" : "Female"}</span>
            </div>

            <div className="w-full text-[0.97rem] flex gap-1 items-center text-gray-700">
              <LuHouse className="opacity-70 text-sm" />
              <span>{details.address}</span>
            </div>

            <div className="w-full text-[0.97rem] flex gap-1 items-center text-gray-700">
              <LuCalendar className="opacity-70 text-sm" />
              <span>
                {dayjs(details.applicationDate).format("DD MMM YYYY")}
              </span>
            </div>
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

        <div className="col-span-2 max-md:col-span-1">
          <h3 className="text-2xl mb-1.75!">Details:</h3>
          <div className="flex flex-col gap-1"></div>
          <div className="w-full flex flex-col gap-2 ml-2!">
            <div className="w-full h-full">
              <h4 className="text-lg mb-0.5!">Description:</h4>
              <div className="ml-2!">
                <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                  <p>{details.description}</p>
                </div>
              </div>
            </div>
            <div className="w-full h-full">
              <h4 className="text-lg mb-0.5!">Previous Experience:</h4>
              <div className="ml-2!">
                <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
                  {details.hasPreviousExperience ? (
                    <p>
                      {details.previousExperienceDetails ||
                        "No details provided."}
                    </p>
                  ) : (
                    <p>No previous experience provided.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ApplicationActions
          details={details}
          applicationId={applicationId}
          setModelOpen={setModelOpen}
          version="mobile"
        />

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
              ].map((registration: RegistrationUsingCACode) => {
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

function StatusTags({ details }: { details: CaApplicationDetails }): ReactNode {
  function getStatusTag(
    status: "pending" | "approved" | "rejected",
  ): ReactNode {
    let colorClasses = "";
    switch (status) {
      case "pending":
        colorClasses = "bg-yellow-100 text-yellow-800";
        break;
      case "approved":
        colorClasses = "bg-green-100 text-green-800";
        break;
      case "rejected":
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
          {details.caCode ? `Code: ${details.caCode.toUpperCase()}` : "N/A"}
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
      {details.status === "rejected" && details.rejectionReason && (
        <div className="w-full bg-red-50 border border-red-200 text-red-800 text-sm p-3! rounded mt-2!">
          <h4 className="font-medium mb-1!">Rejection Reason:</h4>
          <p>{details.rejectionReason}</p>
        </div>
      )}
    </>
  );
}

function ApplicationActions({
  details,
  applicationId,
  setModelOpen,
  version,
}: {
  details: CaApplicationDetails;
  applicationId: string;
  setModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  version: "desktop" | "mobile";
}): ReactNode {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editModelOpen, setEditModelOpen] = useState(false);
  const applicationMutation = useCaApplicationMutation();

  return (
    <div className="col-span-2 max-md:col-span-1">
      <h3 className="text-2xl mb-1.75!">Application Actions:</h3>
      <div className="flex flex-col gap-1"></div>
      <div className="w-full flex flex-wrap items-center gap-4">
        <ChangeStatus
          id={`change-status-details-${applicationId}-${version}`}
          documentId={applicationId}
          setOpen={() => {}}
          mutation={applicationMutation}
          className="max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          insideModel={true}
          isCa={true}
        />
        {details.status === "approved" &&
          details.caCode &&
          details.caCode !== "N/A" && (
            <div>
              <TableBtn
                className="max-w-fit bg-gray-500 text-white hover:bg-secondary-bg/20 border hover:text-black border-gray-500/20 transition-all duration-200"
                aria-label="Delete this data"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditModelOpen(true);
                }}
              >
                <p>Edit CA Code</p>
              </TableBtn>

              <CaCodeModel
                setOpen={setModelOpen}
                mutation={applicationMutation}
                documentId={details._id}
                caCodeModelOpen={editModelOpen}
                setCaCodeModelOpen={setEditModelOpen}
                defaultCode={details.caCode || ""}
              />
            </div>
          )}
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
              applicationMutation.mutate({
                method: "delete",
                documentId: details._id,
              });
              setModelOpen(false);
            }}
            open={deleteOpen}
            setOpen={setDeleteOpen}
            title="Delete Application"
          >
            This will permanently delete this application{" "}
            <span className="font-semibold">{details.name}</span> from the
            application's list and remove all of their data from the server. All
            of their images, links, and other data will be permanently lost.
          </DeleteWarning>
        </div>
      </div>
    </div>
  );
}
