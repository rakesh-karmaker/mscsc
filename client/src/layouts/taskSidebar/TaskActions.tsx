import DeleteWarning from "@/components/ui/DeleteWarning";
import TaskSidebarCard from "@/components/ui/TaskSidebarCard";
import type { Task } from "@/types/taskTypes";
import type { AxiosResponse, AxiosError } from "axios";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type TaskActionsProps = {
  task: Task;
  taskMutation: UseMutationResult<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { method: string; slug: string; position?: string; username: string },
    unknown
  >;
  setSelectedTask?: Dispatch<SetStateAction<Task | null>>;
};

// task actions to edit the task and delete the task
export default function TaskActions({
  task,
  taskMutation,
  ...rest
}: TaskActionsProps): ReactNode {
  const [open, setOpen] = useState(false);

  const onDelete = (slug: string) => {
    taskMutation.mutate({ method: "delete", slug, username: "" });
    setOpen(false);
  };
  return (
    <>
      <TaskSidebarCard title={"Task Actions"}>
        <p>
          To edit the task, click on the edit button and click the delete button
          to delete the task
        </p>
        <div className="task-actions">
          <button
            className="primary-button"
            onClick={() => {
              if (rest.setSelectedTask) {
                rest.setSelectedTask(task);
              }
            }}
          >
            Edit Task
          </button>

          <button
            className="danger-button primary-button"
            aria-label="Delete this data"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete Task
          </button>
        </div>
      </TaskSidebarCard>

      <DeleteWarning
        slug={task.slug}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Task"
      >
        This will permanently delete this task{" "}
        <span className="font-semibold">{task.name}</span> from the task list
        and remove all of its data from the server. All of its images, links,
        and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
}
