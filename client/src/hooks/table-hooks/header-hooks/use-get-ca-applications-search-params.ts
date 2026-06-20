import { getSortingStateParser } from "@/lib/parser";
import type {
  CaApplicationsSearchParams,
  CaApplicationTableData,
} from "@/types/event/ca-types";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useGetCaApplicationSearchParams(): CaApplicationsSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<CaApplicationTableData>().withDefault([
      { id: "applicationDate", desc: true },
    ]),
    name: parseAsString.withDefault(""),
    status: parseAsArrayOf(
      parseAsStringEnum(["pending", "approved", "rejected"]),
    ).withDefault([]),
    caCode: parseAsString.withDefault(""),
    hasPreviousExperience: parseAsStringEnum(["yes", "no", "n/a"]).withDefault(
      "n/a",
    ),
  });

  return params;
}
