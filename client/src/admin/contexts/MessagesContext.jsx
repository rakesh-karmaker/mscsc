import { createContext, useContext, useState, useEffect } from "react";
import { getAllMessages } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
const MessagesContext = createContext(null);

const MessagesProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["messages", page, search],
    queryFn: () => getAllMessages(page, 10, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    refetch();
  }, [page, search, refetch]);

  const response = data?.data;
  const messages = data?.data?.results;
  const length = data?.data?.selectedLength || 0;

  return (
    <MessagesContext.Provider
      value={{
        response,
        messages,
        isLoading,
        search,
        setSearch,
        page,
        setPage,
        length,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

const useMessages = () => {
  const context = useContext(MessagesContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { MessagesProvider, useMessages };
