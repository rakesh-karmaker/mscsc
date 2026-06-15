import { getSortingStateParser } from "@/lib/parser";
import type {
  EventTeamsSearchParams,
  EventTeamTableData,
} from "@/types/event/event-team-types";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useGetTeamsSearchParams(): EventTeamsSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<EventTeamTableData>().withDefault([
      { id: "createdAt", desc: true },
    ]),
    teamName: parseAsString.withDefault(""),
    teamStatus: parseAsArrayOf(
      parseAsStringEnum(["pending", "approved", "rejected"]),
    ).withDefault([]),
    teamSegments: parseAsArrayOf(parseAsString).withDefault([]),
  });

  return params;
}
