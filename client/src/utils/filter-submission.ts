import type { Submission, Task } from "@/types/task-types";
import getPosition from "./get-position";

export default function filterSubmission(
  task: Task,
  submissions: Submission[],
) {
  if (!submissions || submissions.length === 0) return [];

  const podium: {
    first: Submission | null;
    second: Submission | null;
    third: Submission | null;
  } = {
    first: null,
    second: null,
    third: null,
  };

  const regularSubmissions: Submission[] = [];

  for (const submission of submissions) {
    const memberId = submission.memberId || "";
    const position = getPosition(task, memberId);

    if (position === "first") {
      podium.first = submission;
    } else if (position === "second") {
      podium.second = submission;
    } else if (position === "third") {
      podium.third = submission;
    } else {
      regularSubmissions.push(submission);
    }
  }

  const sortedWinners = [podium.first, podium.second, podium.third].filter(
    (sub): sub is Submission => sub !== null,
  );

  return [...sortedWinners, ...regularSubmissions];
}
