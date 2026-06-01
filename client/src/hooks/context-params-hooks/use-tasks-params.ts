import type { TasksParams } from "@/types/task-types";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export default function useTasksParams(): [
  TasksParams,
  (newParams: Partial<TasksParams>) => void,
] {
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    category: parseAsStringEnum([
      "article writing",
      "poster design",
      "",
    ]).withDefault(""),
  });

  return [params, setParams];
}
