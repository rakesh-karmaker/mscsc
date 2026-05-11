import { getSortingStateParser } from "@/lib/parser";
import type {
  MembersSearchParams,
  MemberTableData,
} from "@/types/member-types";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useGetMembersSearchParams(): MembersSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<MemberTableData>().withDefault([
      { id: "createdAt", desc: true },
    ]),
    name: parseAsString.withDefault(""),
    batch: parseAsInteger.withDefault(-1),
    branch: parseAsArrayOf(
      parseAsStringEnum([
        "Main Boys",
        "Main Girls",
        "Branch - 1",
        "Branch - 2",
        "Branch - 3",
      ]),
    ).withDefault([]),
    position: parseAsArrayOf(
      parseAsStringEnum(["member", "executive", "admin"]),
    ).withDefault([]),
  });

  return params;
}
