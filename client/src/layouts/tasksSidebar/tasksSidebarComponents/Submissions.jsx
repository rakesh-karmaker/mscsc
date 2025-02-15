import { useState } from "react";
import dayAgo from "@/utils/dayAgo";
import { TaskSidebarCard } from "../TasksSidebar";
import { Submitter } from "../TasksSidebar";
import EmptyData from "@/components/UI/EmptyData/EmptyData";

const Submissions = ({ task, admin }) => {
  const [expanded, setExpanded] = useState(false);

  const sortedSubmissions = task?.submissions.sort((a, b) => {
    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);
    return dateB - dateA;
  });

  const filteredSubmissions = task?.champion
    ? [
        task?.submissions.find(
          (submission) => submission.username === task?.champion
        ),
        ...task?.submissions.filter(
          (submission) => submission.username !== task?.champion
        ),
      ]
    : sortedSubmissions;

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
                      champion={member.username === task?.champion}
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

export default Submissions;
