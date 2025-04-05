import { useState } from "react";
import dayAgo from "@/utils/dayAgo";
import { TaskSidebarCard } from "../TasksSidebar";
import { Submitter } from "../TasksSidebar";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import getPosition from "@/utils/getPosition";
import { useUser } from "@/contexts/UserContext";

const Submissions = ({ task, admin }) => {
  const [expanded, setExpanded] = useState(false);
  const { user, isVerifying } = useUser();

  const sortedSubmissions = task?.submissions.sort((a, b) => {
    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);
    return dateB - dateA;
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
              .map((member) => {
                return (
                  <li key={member.username}>
                    <Submitter
                      member={member}
                      url={`${admin ? "/admin" : ""}/task/${task?.slug}?user=${
                        member.username
                      }`}
                      value={dayAgo(member.submissionDate)}
                      task={task}
                    />
                  </li>
                );
              })
          ) : (
            <EmptyData />
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
};

const filterSubmission = (task, submissions) => {
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
};

export default Submissions;
