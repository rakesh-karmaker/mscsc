import type { Submission, Task } from "@/types/taskTypes";
import getPosition from "./getPosition";

export default function filterSubmission(
  task: Task,
  submissions: Submission[]
) {
  const filteredData = [];

  // get the winner submissions
  for (let i = 0; i < submissions?.length; i++) {
    if (getPosition(task, submissions[i].username) !== null) {
      // filter the first, second, third
      const position = getPosition(task, submissions[i].username);
      if (position === "first") {
        filteredData.unshift(submissions[i]);
      } else if (position === "second") {
        filteredData.splice(task.first ? 1 : 0, 0, submissions[i]);
      } else if (position === "third") {
        filteredData.splice(
          task.first ? (task.second ? 2 : 1) : task.second ? 1 : 0,
          0,
          submissions[i]
        );
      }
    }
  }

  // get the rest submissions
  for (let i = 0; i < submissions?.length; i++) {
    if (getPosition(task, submissions[i].username) === null) {
      filteredData.push(submissions[i]);
    }
  }

  return filteredData;
}
