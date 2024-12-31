import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { getAllActivities } from "@/services/GetService";

const ActivitiesContext = createContext();

const ActivitiesProvider = ({ children }) => {
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["activities", page, topic, search],
    queryFn: () => {
      return getAllActivities(page, 12, topic, search);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const activities = data?.data ? data.data.results : [];
  const length = data?.data?.totalLength || 0;
  console.log(activities);
  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        length,
        topic,
        setTopic,
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
