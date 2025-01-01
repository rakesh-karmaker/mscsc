import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { getAllActivities } from "@/services/GetService";

const ActivitiesContext = createContext();

const ActivitiesProvider = ({ children }) => {
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["activities", page, tag, search],
    queryFn: () => {
      return getAllActivities(page, 12, tag, search);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
