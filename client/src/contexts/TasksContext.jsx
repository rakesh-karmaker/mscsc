import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getAllTasks } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const TaskContext = createContext(null);

const TaskProvider = ({ children }) => {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [taskType, setTaskType] = useState("");

  useEffect(() => {
    setPage(1);
    setTaskType("");
  }, [search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["tasks", page, search, taskType],
    queryFn: () => getAllTasks(page, 18, search, taskType),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useErrorNavigator(isError, error);

  useEffect(() => {
    refetch();
  }, [page, search, taskType, refetch]);

  const response = data?.data;
  const tasks = data?.data?.results;
  const length = data?.data?.selectedLength || 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        length,
        page,
        setPage,
        search,
        setSearch,
        taskType,
        setTaskType,
        isLoading,
        response,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTask = () => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { TaskProvider, useTask };
