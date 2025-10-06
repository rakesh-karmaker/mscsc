import DeleteWarning from "@/components/ui/DeleteWarning";
import TaskSidebarCard from "@/components/ui/TaskSidebarCard";
import type { Task } from "@/types/taskTypes";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useState, type ReactNode } from "react";

type SubmissionActionsProps = {
  task: Task;
  username: string;
  deleteFunc: (slug: string) => void;
  taskMutation: UseMutationResult<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { method: string; slug: string; username: string; position?: string },
    unknown
  >;
};

type PositionKey = "first" | "second" | "third";

// submission actions to give the submission a position and delete the submission
export default function SubmissionActions({
  task,
  username,
  deleteFunc,
  taskMutation,
}: SubmissionActionsProps): ReactNode {
  const [open, setOpen] = useState(false);

  const setPosition = (position: string, slug: string, username: string) => {
    taskMutation.mutate({ method: "add-position", slug, username, position });
  };

  const deletePosition = (slug: string, username: string) => {
    taskMutation.mutate({ method: "delete-position", slug, username });
  };

  const positionActions: { key: PositionKey; text: string }[] = [
    {
      key: "first",
      text: "1st",
    },
    {
      key: "second",
      text: "2nd",
    },
    {
      key: "third",
      text: "3rd",
    },
  ];

  return (
    <>
      <TaskSidebarCard title={"Submission Actions"}>
        <p>
          Click on the position buttons to give the submitter a position and
          click on the delete button to delete the submission
        </p>
        <div className="task-actions">
          {positionActions.map((position) => {
            return (
              <button
                key={position.key + task.slug + username}
                className={
                  "primary-button" +
                  (task[position.key] === username ? " danger" : "") +
                  (taskMutation.isPending ? " disabled" : "")
                }
                onClick={() =>
                  task[position.key] === username
                    ? deletePosition(task?.slug, username)
                    : setPosition(position.key, task?.slug, username)
                }
              >
                {position.text}
              </button>
            );
          })}

          <button
            className="danger-button primary-button"
            aria-label="Delete this data"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </TaskSidebarCard>

      <DeleteWarning
        slug={task.slug}
        deleteFunc={(slug) => {
          deleteFunc(slug);
          setOpen(false);
        }}
        open={open}
        setOpen={setOpen}
        title="Delete Submission"
      >
        This will permanently delete this submission of{" "}
        <span className="font-semibold">{task.name}</span> from the submission's
        list and remove all of its data from the server. All of its images,
        links, and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
}
