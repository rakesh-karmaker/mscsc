import { verifyToken } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  // localStorage.setItem("token", "");
  const [user, setUser] = useState(null);

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (localStorage.getItem("token")) {
        return verifyToken(localStorage.getItem("token"));
      }
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) console.log(error);

  useEffect(() => {
    setUser(data ? data.data.user : null);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { UserProvider, useUser };
