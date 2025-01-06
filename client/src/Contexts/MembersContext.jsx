import { createContext, useContext, useState, useEffect } from "react";
import { getAllMembers } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import FilterError from "@/utils/FilterError";
const MemberContext = createContext(null);

const MemberProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    setBranch("");
  }, [search]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["members", page, search, role, branch],
    queryFn: () => getAllMembers(page, 12, search, role, branch),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    <FilterError error={error} />;
    return;
  }

  useEffect(() => {
    refetch();
  }, [page, search, role, refetch]);

  const response = data?.data;
  const members = data?.data.results;
  const length = data?.data?.selectedLength || 0;

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
        branch,
        setBranch,
        length,
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
