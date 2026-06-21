import type { Task, TaskPreview } from "@/types/task-types";

export default function getPosition(task: Task | TaskPreview, userId: string) {
  switch (userId) {
    case task.first?.toString():
      return "first";
    case task.second?.toString():
      return "second";
    case task.third?.toString():
      return "third";
    default:
      return null;
  }
}
