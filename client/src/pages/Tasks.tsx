import { useTasks } from "@/contexts/TasksContext";
import { useUser } from "@/contexts/UserContext";
import SearchInput from "@/components/ui/searchInput/SearchInput";
import Loader from "@/components/ui/loader/Loader";
import TaskList from "@/components/tasks/taskList/TaskList";
import TasksSidebar from "@/layouts/tasksSidebar/TasksSidebar";

export default function Tasks({ admin }: { admin?: boolean }) {
  // check if the user is logged in
  const { user, isVerifying } = useUser();

  const submissions = user?.submissions.map((s) => s.taskId.toString());

  const { tasks, length, page, setPage, search, setSearch, isLoading } =
    useTasks();

  return (
    <main
      className={`w-full ${
        admin
          ? "w-full !pt-5"
          : "max-w-[1400px] min-h-[calc(100svh-var(--nav-height))] !pt-[calc(var(--nav-height)+3rem)] !pb-25 max-[1000px]:!pt-[calc(var(--nav-height)+2rem)]"
      } h-full flex !flex-row  justify-between !items-start gap-4 max-[1500px]:max-w-max-width max-[1000px]:!flex-col max-[1000px]:gap-10`}
    >
      {isVerifying ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex flex-col gap-4 min-h-full">
            <SearchInput
              search={search}
              setSearch={setSearch}
              style={{ maxWidth: "100%" }}
            >
              Search tasks...
            </SearchInput>

            {isLoading ? (
              <Loader />
            ) : (
              <TaskList
                tasks={tasks || []}
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
}
