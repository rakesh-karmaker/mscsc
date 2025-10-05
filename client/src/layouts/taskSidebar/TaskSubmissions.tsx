import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import type { Task } from "@/types/taskTypes";
import TaskSidebarCard from "@/components/ui/TaskSidebarCard";
import TaskSubmitter from "@/components/ui/TaskSubmitter";
import Empty from "@/components/ui/empty/Empty";
import filterSubmission from "@/utils/filterSubmission";
import DayAgo from "@/utils/DayAgo";

export default function Submissions({
  task,
  admin,
}: {
  task: Task;
  admin?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { user, isVerifying } = useUser();

  const sortedSubmissions = task?.submissions.sort((a, b) => {
    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);
    return dateB.getTime() - dateA.getTime();
  });

  const filteredSubmissions =
    task?.first || task?.second || task?.third
      ? filterSubmission(task, sortedSubmissions)
      : sortedSubmissions;

  if (
    isVerifying ||
    (user && user.position === "member" && !admin) ||
    (!isVerifying && !user)
  )
    return null;

  return (
    <TaskSidebarCard title={"Submissions"}>
      <>
        <ul className="top-submissions">
          {filteredSubmissions?.length > 0 && filteredSubmissions[0] ? (
            filteredSubmissions
              ?.slice(0, expanded ? task?.submissions?.length : 8)
              .map((submission) => {
                return (
                  <li key={submission.username}>
                    <TaskSubmitter
                      submitter={submission}
                      url={`${admin ? "/admin" : ""}/task/${task?.slug}?user=${
                        submission.username
                      }`}
                      value={<DayAgo date={submission.submissionDate} />}
                      task={task}
                    />
                  </li>
                );
              })
          ) : (
            <Empty />
          )}
        </ul>

        {task?.submissions?.length > 8 && (
          <p
            className="show-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer" }}
          >
            {expanded ? "Show less" : "Show more"}
          </p>
        )}
      </>
    </TaskSidebarCard>
  );
}
