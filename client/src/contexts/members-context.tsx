import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllMembers } from "@/lib/api/member";
import type { MembersContextType } from "@/types/context-types";

const MembersContext = createContext<MembersContextType | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
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
  const length = data?.data?.totalLength || 0;

  return (
    <MembersContext.Provider
      value={{
        response,
        members,
        isLoading,
        search,
        setSearch,
        page,
        setPage,
        role,
        setRole,
        branch,
        setBranch,
        length,
        position,
        setPosition,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers(): MembersContextType {
  const context = useContext(MembersContext);

  if (context === undefined) {
    throw new Error("useMembers must be used within a MembersProvider");
  }

  return context as MembersContextType;
}
