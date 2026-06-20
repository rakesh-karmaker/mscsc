import type { MembersParams } from "@/types/member-types";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default function useMembersParams(): [
  MembersParams,
  (newParams: Partial<MembersParams>) => void,
] {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    branch: parseAsString.withDefault(""),
  });

  return [params, setParams];
}
