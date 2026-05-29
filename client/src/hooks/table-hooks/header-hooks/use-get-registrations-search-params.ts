import { getSortingStateParser } from "@/lib/parser";
import type {
  EventRegistrationsSearchParams,
  EventRegistrationTableData,
} from "@/types/event/event-registration-types";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useGetRegistrationsSearchParams(): EventRegistrationsSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<EventRegistrationTableData>().withDefault([
      { id: "registrationDate", desc: true },
    ]),
    regName: parseAsString.withDefault(""),
    regStatus: parseAsArrayOf(
      parseAsStringEnum(["pending", "approved", "rejected"]),
    ).withDefault([]),
    regCategory: parseAsArrayOf(
      parseAsStringEnum(["primary", "junior", "secondary", "higher secondary"]),
    ).withDefault([]),
    regSegments: parseAsArrayOf(parseAsString).withDefault([]),
    regCode: parseAsString.withDefault(""),
    regTransactionMethod: parseAsArrayOf(
      parseAsStringEnum(["bkash", "nagad", "rocket", "other"]),
    ).withDefault([]),
  });

  return params;
}
