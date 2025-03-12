import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { TaskSidebarCard } from "../TasksSidebar";
import SubmitImage from "./SubmitImage";

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

  return (
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
            <DeleteBtn
              id={task.slug}
              deleteFunc={deleteFunc}
              btnText="Delete"
              slug={task.slug}
              title="Delete Submission"
            >
              Are you sure you want to delete your submission of {task.name}?
            </DeleteBtn>
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
  );
};

export default SubmitCard;
