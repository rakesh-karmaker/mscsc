import { verifyToken } from "@/lib/api/auth";
import type { UserContextType } from "@/types/context-types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    data,
    error,
    isLoading: isVerifying,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (localStorage.getItem("token")) {
        return verifyToken();
      }
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) console.log(error);
  const user = data ? data.data.user : null;

  return (
    <UserContext.Provider value={{ user, isVerifying }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context as UserContextType;
}
