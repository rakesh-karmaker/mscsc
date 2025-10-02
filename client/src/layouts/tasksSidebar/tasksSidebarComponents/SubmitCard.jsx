import { DeleteWarning } from "@/components/UI/DeleteWarning";
import { TaskSidebarCard } from "../TasksSidebar";
import SubmitImage from "./SubmitImage";
import { useState } from "react";

const SubmitCard = ({
  task,
  register,
  onClick,
  errors,
  deleteFunc,
  isSubmitting,
  username,
}) => {
  const didSubmit = task?.submissions?.find((s) => s.username === username);

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
                onClick={(e) => {
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
            didSubmit={didSubmit}
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
};

export default SubmitCard;
