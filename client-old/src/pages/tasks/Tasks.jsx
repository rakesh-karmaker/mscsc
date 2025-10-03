import Loader from "@/components/UI/Loader/Loader";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useTask } from "@/contexts/TasksContext";
import { useUser } from "@/contexts/UserContext";

import TaskList from "@/components/tasksComponents/tasksList/TaskList";
import { TasksSidebar } from "@/layouts/tasksSidebar/TasksSidebar";

import "./Tasks.css";
const Tasks = ({ admin }) => {
  // check if the user is logged in
  const { user, isVerifying } = useUser();

  const submissions = user?.submissions.map((s) => s.taskId.toString());

  const { tasks, length, page, setPage, search, setSearch, isLoading } =
    useTask();

  return (
    <main className="page-tasks">
      {isVerifying ? (
        <Loader />
      ) : (
        <>
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
                admin={admin}
              />
            )}
          </div>
          <TasksSidebar admin={admin} />
        </>
      )}
    </main>
  );
};

export default Tasks;
