import { getSortingStateParser } from "@/lib/parser";
import type {
  ClubPartnerSearchParams,
  ClubPartnerTableData,
} from "@/types/event/club-partner-types";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useClubPartnersSearchParams(): ClubPartnerSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<ClubPartnerTableData>().withDefault([
      { id: "score", desc: true },
    ]),
    clubName: parseAsString.withDefault(""),
    clubStatus: parseAsArrayOf(
      parseAsStringEnum(["active", "inactive"]),
    ).withDefault([]),
  });

  return params;
}
