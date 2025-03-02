import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getTopSubmitters } from "@/services/GetService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTask } from "@/contexts/TasksContext";
import { useRef, useEffect, useState } from "react";
import Counter from "@/components/UI/Counter/Counter";

import "./TasksSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { deleteSubmission } from "@/services/DeleteService";
import toast from "react-hot-toast";
import AdminTaskActions from "./tasksSidebarComponents/AdminTaskActions";
import SubmitImage from "./tasksSidebarComponents/SubmitImage";
import Submissions from "./tasksSidebarComponents/Submissions";
import Submitters from "./tasksSidebarComponents/Submitters";
import getPosition from "@/utils/getPosition";

const TasksSidebar = ({ admin }) => {
  const { category: currentCategory, setCategory, response } = useTask();
  const { user, isVerifying } = useUser();
  const totalLengthRef = useRef(null);
  const [initialTotalLength, setInitialTotalLength] = useState(null);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["topSubmitters", isVerifying, user],
    queryFn: () => {
      if (!isVerifying && user) {
        return getTopSubmitters();
      } else {
        return null;
      }
    },
  });

  useErrorNavigator(isError, error);

  const categories = ["Article Writing", "Poster Design"];

  // Set the initial value of totalLengthRef
  useEffect(() => {
    if (
      totalLengthRef.current === null &&
      response?.totalLength !== undefined
    ) {
      totalLengthRef.current = response.totalLength;
      setInitialTotalLength(response.totalLength);
    }
  }, [response?.totalLength]);

  return (
    <aside className="tasks-sidebar">
      <TaskSidebarCard title={"Category"}>
        {categories.map((category) => {
          return (
            <p
              key={category}
              className={
                "task-category" +
                (category === currentCategory ? " active" : "")
              }
              onClick={() => setCategory(category.toLowerCase())}
            >
              {category}
            </p>
          );
        })}
      </TaskSidebarCard>

      {admin ? null : (
        <TaskSidebarCard title={"Task Completed"}>
          <p className="task-number">
            <span>{user?.submissions.length}</span>
            <span>/</span>
            <span>{initialTotalLength}</span>
          </p>
        </TaskSidebarCard>
      )}

      <Submitters data={data} isLoading={isLoading} title={"Top Submitters"} />
    </aside>
  );
};

const TaskSidebar = ({
  task,
  register,
  onClick,
  errors,
  editable,
  setEditable,
  mode,
  isSubmitting,
  username,
  admin,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const submissionDelete = useMutation({
    mutationFn: (slug) => {
      return deleteSubmission(slug, username);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["task"]);
      setEditable(false);
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const deleteFunc = (slug) => {
    submissionDelete.mutate(slug);
  };
  return (
    <aside className="task-sidebar">
      <TaskSidebarCard title={"Description"}>
        <p className="task-description">{task.summary}</p>
      </TaskSidebarCard>

      {mode === "edit" && !admin ? (
        <TaskSidebarCard title={"Submit"}>
          <p>
            Add a poster for the task and click submit to submit your work.
            {editable && " To delete your submission click the delete button."}
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
              {editable && (
                <DeleteBtn
                  id={task.slug}
                  deleteFunc={deleteFunc}
                  btnText="Delete"
                  slug={task.slug}
                  title="Delete Submission"
                >
                  Are you sure you want to delete your submission of {task.name}
                  ?
                </DeleteBtn>
              )}
            </div>
            <SubmitImage
              register={register}
              errors={errors}
              editable={editable}
            />
          </div>
        </TaskSidebarCard>
      ) : null}

      {admin && (
        <AdminTaskActions
          task={task}
          username={username}
          deleteFunc={deleteFunc}
          queryClient={queryClient}
          {...rest}
        />
      )}

      <TaskSidebarCard title={"Time left"}>
        <Counter date={task.deadline} />
      </TaskSidebarCard>

      <Submissions task={task} admin={admin} />
    </aside>
  );
};

const Submitter = ({ member, value, url, ...rest }) => {
  const { name, branch, batch, image, username } = member;

  const position = rest?.task && getPosition(rest?.task, username);

  return (
    <NavLink to={url} className={"top-submitter"}>
      <div className="member-info">
        <img src={image} alt={name} />
        <div>
          <p className="member-name">
            {name}
            {position && (
              <FontAwesomeIcon
                icon="fa-solid fa-crown"
                className={"winner " + position}
              />
            )}
          </p>
          <p className="member-branch-batch">
            {branch}, {batch}
          </p>
        </div>
      </div>
      <p className="value">{value}</p>
    </NavLink>
  );
};

const TaskSidebarCard = ({ title, children }) => {
  return (
    <div className="task-sidebar-card">
      <p className="task-sidebar-card-title">{title}</p>
      <div className="task-sidebar-card-content">{children}</div>
    </div>
  );
};

export { TaskSidebar, TasksSidebar, Submitter, TaskSidebarCard };
