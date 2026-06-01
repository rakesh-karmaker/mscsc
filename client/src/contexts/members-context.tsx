import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getAllMembers } from "@/lib/api/member";
import type { MembersContextType } from "@/types/context-types";
import useMembersParams from "@/hooks/context-params-hooks/use-members-params";

const MembersContext = createContext<MembersContextType | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useMembersParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["members", params],
    queryFn: () => getAllMembers(12, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useErrorNavigator(isError, error);

  const response: any = data?.data;
  const members: any[] = data?.data.results;
  const length: number = data?.data?.totalLength || 0;

  return (
    <MembersContext.Provider
      value={{
        response,
        members,
        isLoading,
        length,
        params,
        setParams,
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
