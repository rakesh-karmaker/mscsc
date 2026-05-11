import Loader from "@/components/ui/loader/loader";
import { getRegistrationById } from "@/lib/api/event-registrations";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";

export default function RegistrationDetails({
  registrationId,
}: {
  registrationId: string;
}): ReactNode {
  const eventId = useParams().eventSlug!;

  const { data: registrationData, isLoading } = useQuery({
    queryKey: ["registration", eventId, registrationId],
    queryFn: () => getRegistrationById(eventId, registrationId),
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

  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      hello
    </div>
  );
}
