import { getSortingStateParser } from "@/lib/parser";
import type {
  EventRegistrationsSearchParams,
  EventRegistrationTableData,
} from "@/types/event-types";
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
      { id: "createdAt", desc: true },
    ]),
    name: parseAsString.withDefault(""),
    status: parseAsArrayOf(
      parseAsStringEnum(["pending", "approved", "rejected"]),
    ).withDefault([]),
    category: parseAsArrayOf(
      parseAsStringEnum(["primary", "junior", "secondary", "higher secondary"]),
    ).withDefault([]),
    segments: parseAsArrayOf(parseAsString).withDefault([]),
    code: parseAsString.withDefault(""),
    transactionMethod: parseAsArrayOf(
      parseAsStringEnum(["bkash", "nagad", "rocket", "other"]),
    ).withDefault([]),
  });

  return params;
}
