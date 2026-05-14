import type { EventRegistrationDetails } from "@/types/event-types";
import capitalize from "@/utils/capitalize";
import { Tooltip } from "@mui/material";
import type { ReactNode } from "react";
import {
  LuCircleCheck,
  LuCircleX,
  LuEye,
  LuLoaderPinwheel,
} from "react-icons/lu";
import RegistrationDetailsModel from "../registrations-table/registration-details-model";

export default function RegistrationPreview({
  details,
  previousModels,
  registrationMutation,
}: {
  details: Pick<
    EventRegistrationDetails,
    "_id" | "name" | "email" | "status" | "photoUrl"
  >;
  previousModels: {
    registrations: string[];
    teams: string[];
  };
  registrationMutation: any;
}): ReactNode {
  const statusIcons = {
    pending: (
      <div className="bg-yellow-100 text-yellow-800 text-base p-1! rounded-full">
        <LuLoaderPinwheel className="opacity-70 " />
      </div>
    ),
    validated: (
      <div className="bg-green-100 text-green-800 text-base p-1! rounded-full">
        <LuCircleCheck className="opacity-70 " />
      </div>
    ),
    rejected: (
      <div className="bg-red-100 text-red-800 text-base p-1! rounded-full">
        <LuCircleX className="opacity-70" />
      </div>
    ),
  };
  return (
    <div className="w-full h-full flex max-xs:flex-col justify-between xs:items-center gap-5 max-xs:gap-1">
      <div className="w-full flex gap-2 items-center">
        <img
          src={details.photoUrl}
          alt={details.name}
          className="w-10 h-10 rounded-full object-cover object-center"
        />
        <div className="flex flex-col">
          <div className="w-full flex gap-1 items-center">
            <span className="font-medium">{details.name}</span>
            <span className="w-fit h-fit">
              {statusIcons[details.status] && (
                <Tooltip
                  title={`Registration status: ${capitalize(details.status)}`}
                  placement="top"
                  arrow
                >
                  {statusIcons[details.status]}
                </Tooltip>
              )}
            </span>
          </div>
          <span className="text-sm text-gray-600">{details.email}</span>
        </div>
      </div>
      <div>
        <RegistrationDetailsModel
          registrationId={details._id}
          setOpen={() => {}}
          className={`bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200 mt-1! ${previousModels.registrations.includes(details._id) && "pointer-events-none opacity-50 cursor-not-allowed"}`}
          previousModels={{
            registrations: [...previousModels.registrations, details._id],
            teams: previousModels.teams,
          }}
          registrationMutation={registrationMutation}
        >
          <Tooltip title="View Registration Details" placement="top" arrow>
            <div className="max-xs:flex gap-2 items-center">
              <LuEye className="w-5 h-5" />
              <p className="xs:hidden">View Details</p>
            </div>
          </Tooltip>
        </RegistrationDetailsModel>
      </div>
    </div>
  );
}
