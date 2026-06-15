import type { ReactNode } from "react";
import capitalize from "./capitalize";
import type { EventRegistrationDetails } from "@/types/event/event-registration-types";
import type {
  EventTeamData,
  EventTeamPreviewData,
} from "@/types/event/event-team-types";
import type { CaApplicationDetails } from "@/types/event/ca-types";

export function TeamStatusTag({
  details,
  isPreview = false,
}: {
  details: EventTeamPreviewData | EventTeamData;
  isPreview?: boolean;
}): ReactNode {
  function getStatusTag(status: EventTeamData["status"]): ReactNode {
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
      <span
        className={`text-sm py-1! px-2! rounded ${colorClasses} inline-block`}
      >
        {capitalize(status)}
      </span>
    );
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">{getStatusTag(details.status)}</div>
      {!isPreview &&
        details.status === "rejected" &&
        "rejectionReason" in details &&
        details.rejectionReason && (
          <div className="w-full bg-red-50 border border-red-200 text-red-800 text-sm p-3! rounded mt-2!">
            <h4 className="font-medium mb-1!">Rejection Reason:</h4>
            <p>{details.rejectionReason}</p>
          </div>
        )}
    </>
  );
}

export function RegistrationStatusTags({
  details,
}: {
  details: EventRegistrationDetails;
}): ReactNode {
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
    <>
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
    </>
  );
}

export function CAStatusTags({
  details,
}: {
  details: CaApplicationDetails;
}): ReactNode {
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
          className={`text-sm py-1! px-2! rounded bg-gray-100 text-gray-900 inline-block`}
        >
          #{details.position}
        </span>
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
