import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllActivities } from "@/lib/api/activities";
import type { ActivitiesContextType } from "@/types/context-types";

const ActivitiesContext = createContext<ActivitiesContextType | null>(null);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTag("");
  }, [search]);

  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ["activities", page, tag, search],
    queryFn: () => {
      return getAllActivities(page, 12, tag, search);
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  useEffect(() => {
    setPage(1);
  }, [tag, search]);

  useEffect(() => {
    refetch();
  }, [page, search, tag, refetch]);

  useErrorNavigator(isError, error);

  const activities = data?.data ? data.data.results : [];
  const length = data?.data?.totalLength || 0;

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        length,
        tag,
        setTag,
        search,
        setSearch,
        page,
        setPage,
        isLoading,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities(): ActivitiesContextType {
  const context = useContext(ActivitiesContext);

  if (context === undefined) {
    throw new Error("useActivities must be used within a ActivitiesProvider");
  }

  return context as ActivitiesContextType;
}
