import useTasksParams from "@/hooks/context-params-hooks/use-tasks-params";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllTasks } from "@/lib/api/task";
import type { TasksContextType } from "@/types/context-types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, type ReactNode } from "react";

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useTasksParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getAllTasks(12, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useErrorNavigator(isError, error);

  const response = data?.data;
  const tasks = data?.data?.results;
  const length = data?.data?.selectedLength || 0;

  return (
    <TasksContext.Provider
      value={{
        tasks,
        length,
        isLoading,
        response,
        params,
        setParams,
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
