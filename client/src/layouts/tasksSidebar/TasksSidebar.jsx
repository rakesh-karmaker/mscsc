import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTask } from "@/contexts/TasksContext";
import { useRef, useEffect, useState } from "react";
import Counter from "@/components/UI/Counter/Counter";

import "./TasksSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteSubmission } from "@/services/DeleteService";
import toast from "react-hot-toast";
import AdminTaskActions from "./tasksSidebarComponents/AdminTaskActions";
import Submissions from "./tasksSidebarComponents/Submissions";
import Submitters from "./tasksSidebarComponents/Submitters";
import getPosition from "@/utils/getPosition";
import SubmitCard from "./tasksSidebarComponents/SubmitCard";

const TasksSidebar = ({ admin }) => {
  const { category: currentCategory, setCategory, response } = useTask();
  const { user } = useUser();
  const totalLengthRef = useRef(null);
  const [initialTotalLength, setInitialTotalLength] = useState(null);

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

      {admin || !user ? null : (
        <TaskSidebarCard title={"Task Completed"}>
          <p className="task-number">
            <span>{user?.submissions.length}</span>
            <span>/</span>
            <span>{initialTotalLength}</span>
          </p>
        </TaskSidebarCard>
      )}

      <Submitters title={"Top Submitters"} />
    </aside>
  );
};

const TaskSidebar = ({
  task,
  register,
  onClick,
  errors,
  mode,
  isSubmitting,
  username,
  admin,
  canSubmit,
  setShowModeChange,
  ...rest
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submissionDelete = useMutation({
    mutationFn: (slug) => {
      return deleteSubmission(slug, username);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["task"]);
      toast.success(res?.data?.message);
      setShowModeChange(false);
      admin && navigate("/admin/task/" + task?.slug);
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

      {mode === "edit" && canSubmit ? (
        <SubmitCard
          task={task}
          register={register}
          onClick={onClick}
          errors={errors}
          deleteFunc={deleteFunc}
          isSubmitting={isSubmitting}
          username={username}
        />
      ) : null}

      {mode === "edit" && !admin && !username && (
        <TaskSidebarCard title={"Login to submit"}>
          <p>
            You need to login to your account to be able to submit the task.
          </p>
          <NavLink to="/auth/login" className="primary-button">
            Login
          </NavLink>
        </TaskSidebarCard>
      )}

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
