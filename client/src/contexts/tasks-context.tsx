import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllTasks } from "@/lib/api/task";
import type { TasksContextType } from "@/types/context-types";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setPage(1);
    setCategory("");
  }, [search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["tasks", page, search, category],
    queryFn: () => getAllTasks(page, 12, search, category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useErrorNavigator(isError, error);

  useEffect(() => {
    refetch();
  }, [page, search, category, refetch]);

  const response = data?.data;
  const tasks = data?.data?.results;
  const length = data?.data?.selectedLength || 0;

  return (
    <TasksContext.Provider
      value={{
        tasks,
        length,
        page,
        setPage,
        search,
        setSearch,
        category,
        setCategory,
        isLoading,
        response,
        refetch,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextType {
  const context = useContext(TasksContext);

  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }

  return context as TasksContextType;
}
