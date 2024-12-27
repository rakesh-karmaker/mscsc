import { createContext, useContext, useState, useEffect } from "react";
import { getAllMembers } from "@/services/GetService";

const MemberContext = createContext(null);

const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getAllMembers();
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to get members", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <MemberContext.Provider value={{ members, isLoading }}>
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
