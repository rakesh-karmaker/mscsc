import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getTopSubmitters } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import Loader from "@/components/UI/Loader/Loader";
import { useUser } from "@/contexts/UserContext";
import { useTask } from "@/contexts/TasksContext";

import "./TasksSidebar.css";

const TasksSidebar = () => {
  const { taskType: currentTaskType, setTaskType, response } = useTask();
  const { user } = useUser();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topSubmitters"],
    queryFn: getTopSubmitters,
  });

  useErrorNavigator(isError, error);

  const taskTypes = ["Article Writing", "Poster Design"];

  return (
    <aside className="tasks-sidebar">
      <TaskSidebarCard title={"Category"}>
        {taskTypes.map((taskType) => {
          return (
            <p
              key={taskType}
              className={
                "task-category" +
                (taskType === currentTaskType ? " active" : "")
              }
              onClick={() => setTaskType(taskType.toLowerCase())}
            >
              {taskType}
            </p>
          );
        })}
      </TaskSidebarCard>

      <TaskSidebarCard title={"Task Completed"}>
        <p className="task-number">
          <span>{user?.submissions.length}</span>
          <span>/</span>
          <span>{response?.totalLength}</span>
        </p>
      </TaskSidebarCard>

      <Submitters data={data} isLoading={isLoading} title={"Top Submitters"} />
    </aside>
  );
};

const Submitters = ({ data, isLoading, title }) => {
  return (
    <TaskSidebarCard title={title}>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="top-submitters">
          {data?.data.map((member) => {
            return (
              <li key={member._id}>
                <NavLink
                  to={`/member/${member.slug}`}
                  className={"top-submitter"}
                >
                  <div className="member-info">
                    <img src={member.image} alt={member.name} />
                    <div>
                      <p className="member-name">{member.name}</p>
                      <p className="member-branch-batch">
                        {member.branch}, {member.batch}
                      </p>
                    </div>
                  </div>
                  <p className="tasks-completed">{member.tasksCompleted}</p>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </TaskSidebarCard>
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

export default TasksSidebar;
