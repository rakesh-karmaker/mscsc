import Loader from "@/components/UI/Loader/Loader";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useTask } from "@/contexts/TasksContext";
import { useUser } from "@/contexts/UserContext";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TaskList from "@/components/tasksComponents/tasksList/TaskList";
import { TasksSidebar } from "@/layouts/tasksSidebar/TasksSidebar";

import "./Tasks.css";
const Tasks = () => {
  // check if the user is logged in
  const { user, isVerifying } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isVerifying && user === null) {
      navigate("/401", { replace: true });
    }
  }, [user, navigate, isVerifying]);

  const submissions = user?.submissions.map((s) => s.taskId.toString());

  const { tasks, length, page, setPage, search, setSearch, isLoading } =
    useTask();

  return (
    <main className="page-tasks">
      <div className="task-list">
        <SearchInput search={search} setSearch={setSearch}>
          Search tasks...
        </SearchInput>

        {isLoading ? (
          <Loader />
        ) : (
          <TaskList
            tasks={tasks}
            length={length}
            page={page}
            setPage={setPage}
            submissions={submissions}
            username={user?.slug}
          />
        )}
      </div>
      <TasksSidebar />
    </main>
  );
};

export default Tasks;
