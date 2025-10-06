import type { Task, TaskPreview } from "@/types/taskTypes";

export default function getPosition(
  task: Task | TaskPreview,
  username: string
) {
  switch (username) {
    case task.first:
      return "first";
    case task.second:
      return "second";
    case task.third:
      return "third";
    default:
      return null;
  }
}
