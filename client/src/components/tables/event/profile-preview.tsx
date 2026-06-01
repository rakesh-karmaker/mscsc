import type {
  CaPreviewData,
  EventRegistrationDetails,
} from "@/types/event/event-registration-types";
import capitalize from "@/utils/capitalize";
import { Tooltip } from "@mui/material";
import type { ReactNode } from "react";
import LuCircleCheck from "~icons/lucide/circle-check";
import LuCircleX from "~icons/lucide/circle-x";
import LuTimer from "~icons/lucide/timer";

interface ProfilePreviewProps {
  details:
    | Pick<
        EventRegistrationDetails,
        "_id" | "name" | "email" | "status" | "photoUrl"
      >
    | CaPreviewData;
  children: ReactNode;
}

export default function ProfilePreview({
  details,
  children,
}: ProfilePreviewProps): ReactNode {
  const statusIcons = {
    pending: (
      <div className="bg-yellow-100 text-yellow-800 text-base p-1! rounded-full">
        <LuTimer className="opacity-70 " />
      </div>
    ),
    validated: (
      <div className="bg-green-100 text-green-800 text-base p-1! rounded-full">
        <LuCircleCheck className="opacity-70 " />
      </div>
    ),
    approved: (
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
          <span className="text-sm text-gray-600">
            {"caCode" in details ? details.caCode : details.email}
          </span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
