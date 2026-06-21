import { getSortingStateParser } from "@/lib/parser";
import type {
  MembersSearchParams,
  MemberTableData,
} from "@/types/member-types";
import { ROLES } from "@/utils/require-minimum-role";
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
    batch: parseAsString.withDefault(""),
    branch: parseAsArrayOf(
      parseAsStringEnum([
        "Main Boys",
        "Main Girls",
        "Branch - 1",
        "Branch - 2",
        "Branch - 3",
      ]),
    ).withDefault([]),
    role: parseAsArrayOf(
      parseAsStringEnum([
        ROLES.MEMBER,
        ROLES.EXECUTIVE,
        ROLES.OBSERVER,
        ROLES.EDITOR,
        ROLES.ADMIN,
      ]),
    ).withDefault([]),
  });

  return params;
}
