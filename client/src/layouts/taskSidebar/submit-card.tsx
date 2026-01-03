import DeleteWarning from "@/components/ui/delete-warning";
import TaskSidebarCard from "@/components/ui/task-sidebar-card";
import type { Submission, Task } from "@/types/task-types";
import { useState, type ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import SubmitImage from "./submit-image";

type SubmitCardProps = {
  task: Task;
  register: UseFormRegister<{ content: string; poster: FileList }>;
  onClick: () => void;
  errors: FieldErrors<{ content: string; poster: FileList }>;
  deleteFunc: (slug: string) => void;
  isSubmitting: boolean;
  username: string;
};

export default function SubmitCard({
  task,
  register,
  onClick,
  errors,
  deleteFunc,
  isSubmitting,
  username,
}: SubmitCardProps): ReactNode {
  const didSubmit = task?.submissions?.find(
    (s: Submission) => s.username === username
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      <TaskSidebarCard title={"Submit"}>
        <p>
          Add a poster for the task and click submit to submit your work.
          {didSubmit && " To delete your submission click the delete button."}
        </p>
        <div className="submit-image">
          <div className="submit-actions">
            <button
              onClick={onClick}
              className="primary-button"
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {didSubmit && (
              <button
                className="danger-button primary-button"
                aria-label="Delete this data"
                type="button"
                onClick={(_) => {
                  setOpen(true);
                }}
              >
                Delete Submission
              </button>
            )}
          </div>
          <SubmitImage
            register={register}
            errors={errors}
            didSubmit={!!didSubmit}
            imageRequired={task?.imageRequired}
          />
        </div>
      </TaskSidebarCard>

      <DeleteWarning
        slug={task.slug}
        deleteFunc={deleteFunc}
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
