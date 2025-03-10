import { createContext, useContext, useState, useEffect } from "react";
import { getAllMembers } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
const MemberContext = createContext(null);

const MemberProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    setBranch("");
    setPage(1);
  }, [search, role, position]);

  useEffect(() => {
    setPage(1);
  }, [branch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["members", page, search, role, branch, position],
    queryFn: () => getAllMembers(page, 12, search, role, branch, position),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useErrorNavigator(isError, error);

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
        role,
        position,
        setPosition,
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
