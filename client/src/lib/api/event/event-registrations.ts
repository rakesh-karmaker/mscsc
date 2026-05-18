import { api } from "@/config/axios";
import type { EventRegistrationsSearchParams } from "@/types/event/event-registration-types";

export async function getRegistrations(
  params: EventRegistrationsSearchParams,
  eventSlug: string,
) {
  return api.get(`/event-registrations/${eventSlug}/registrations`, { params });
}

export async function getRegistrationById(
  eventSlug: string,
  registrationId: string,
) {
  return api.get(
    `/event-registrations/${eventSlug}/registrations/${registrationId}`,
  );
}

export async function changeRegistrationStatus(
  eventSlug: string,
  registrationId: string,
  status: "validated" | "rejected" | "pending",
  rejectionReason?: string,
) {
  return api.patch(
    `/event-registrations/${eventSlug}/registrations/${registrationId}/status`,
    {
      status,
      rejectionReason,
    },
  );
}

export async function editRegistration(
  eventSlug: string,
  registrationId: string,
  data: Partial<{
    hasAttended: boolean;
  }>,
) {
  return api.patch(
    `/event-registrations/${eventSlug}/registrations/${registrationId}/edit`,
    data,
  );
}

export async function deleteRegistration(
  eventSlug: string,
  registrationId: string,
) {
  return api.delete(
    `/event-registrations/${eventSlug}/registrations/${registrationId}`,
  );
}
