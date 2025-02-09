import Loader from "@/components/UI/Loader/Loader";
import { useTask } from "@/contexts/TasksContext";
import { useUser } from "@/contexts/UserContext";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getTopSubmitters } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Tasks = () => {
  // check if the user is logged in
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/401", { replace: true });
    }
  }, [user, navigate]);

  const { tasks, length, page, setPage, search, setSearch, isLoading } =
    useTask();

  return (
    <main className="page-tasks">
      <div className="task-list"></div>
      <TasksSidebar />
    </main>
  );
};

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
    <aside>
      <TaskSidebarCard title={"Task Type"}>
        {taskTypes.map((taskType) => {
          return (
            <p
              key={taskType}
              className={
                "task-type" + (taskType === currentTaskType ? " active" : "")
              }
              onClick={() => setTaskType(taskType.toLowerCase())}
            >
              {taskType}
            </p>
          );
        })}
      </TaskSidebarCard>

      <div className="task-sidebar-card submissions">
        <p className="task-number">
          <span>{user?.submissions.length}</span>
          <span>/</span>
          <span>{response?.totalLength}</span>
        </p>
        <p>Tasks Completed</p>
      </div>

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
                <NavLink to={`/member/${member.slug}`}>
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

export default Tasks;
