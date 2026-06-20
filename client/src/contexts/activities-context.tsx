import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllActivities } from "@/lib/api/activities";
import type { ActivitiesContextType } from "@/types/context-types";
import useActivitiesParams from "@/hooks/context-params-hooks/use-activities-params";

const ActivitiesContext = createContext<ActivitiesContextType | null>(null);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useActivitiesParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["activities", params],
    queryFn: () => {
      return getAllActivities(12, params);
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  useErrorNavigator(isError, error);

  const activities = data?.data ? data.data.results : [];
  const length = data?.data?.totalLength || 0;

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        length,
        isLoading,
        params,
        setParams,
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
