import { createContext, useContext, useState, useEffect } from "react";
import { getAllMembers } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
const MemberContext = createContext(null);

const MemberProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["members", page, search, role],
    queryFn: () => getAllMembers(page, 10, search, role, role),
  });

  useEffect(() => {
    refetch();
  }, [page, search, role, refetch]);

  const response = data?.data;
  const members = data?.data.results;

  return (
    <MemberContext.Provider
      value={{
        response,
        members,
        isLoading,
        search,
        setSearch,
        page,
        setPage,
        setRole,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

const useMember = () => {
  const context = useContext(MemberContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { MemberProvider, useMember };
