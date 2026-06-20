import useRegistrationMutation from "@/hooks/event-hooks/use-registration-mutation";
import type { PaidSoloSegment } from "@/types/event/event-registration-types";
import { deSlugify } from "@/utils/de-slugify";
import { RegistrationStatusTags } from "@/utils/get-status-tags";
import type { ReactNode } from "react";
import ChangeStatus from "../change-status";

interface SoloPaidSegmentProps {
  segment: PaidSoloSegment;
  registrationId: string;
}

export default function SoloPaidSegment({
  segment,
  registrationId,
}: SoloPaidSegmentProps): ReactNode {
  const registrationMutation = useRegistrationMutation();

  return (
    <div className="w-full h-full">
      <h4 className="text-lg mb-0.5! flex flex-wrap gap-1 [&>span]:text-xs">
        {deSlugify(segment.segmentSlug, false)}{" "}
        <RegistrationStatusTags details={segment} needAttendanceTag={false} />
      </h4>

      <div className="ml-2!">
        <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
          <span>Phone Number: </span>
          <span className="font-medium ml-1!">
            {segment.transactionPhoneNumber || "N/A"}
          </span>
        </div>
        <div className="w-full text-[0.97rem] flex flex-wrap text-gray-700">
          <span>Transaction ID: </span>
          <span className="font-medium ml-1!">
            {segment.transactionId || "N/A"}
          </span>
        </div>

        {segment.status !== "rejected" ? (
          <ChangeStatus
            id={`change-status-${segment.segmentSlug}`}
            setOpen={() => {}}
            mutation={registrationMutation}
            documentId={registrationId}
            model="segment"
            segmentSlug={segment.segmentSlug}
            insideModel={true}
            className="max-w-fit gap-1.5 mt-1! text-sm bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
          />
        ) : null}
      </div>
    </div>
  );
}
