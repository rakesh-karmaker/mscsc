import type { ActivitiesParams } from "@/types/activity-types";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default function useActivitiesParams(): [
  ActivitiesParams,
  (newParams: Partial<ActivitiesParams>) => void,
] {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    tag: parseAsString.withDefault(""),
  });

  return [params, setParams];
}
