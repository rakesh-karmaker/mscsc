import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect } from "react";
import { getAllActivities } from "@/services/GetService";
import useErrorNavigator from "@/hooks/useErrorNavigator";

const ActivitiesContext = createContext();

const ActivitiesProvider = ({ children }) => {
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
  // if (error) return null;

  const activities = data?.data ? data.data.results : [];
  const length = data?.data?.selectedLength || 0;

  const {
    data: allActivitiesData,
    isLoading: allActivitiesIsLoading,
    error: allActivitiesError,
    isError: allActivitiesIsError,
  } = useQuery({
    queryKey: ["allActivities"],
    queryFn: () => getAllActivities(1, "all", "", ""),
    staleTime: 1000 * 60 * 5,
  });

  useErrorNavigator(allActivitiesIsError, allActivitiesError);

  const allActivities = allActivitiesData?.data;

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
        allActivities,
        allActivitiesIsLoading,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

const useActivities = () => {
  const context = useContext(ActivitiesContext);

  if (context === undefined) {
    throw new Error("useActivities must be used within a ActivitiesProvider");
  }

  return context;
};

export { ActivitiesProvider, useActivities };
