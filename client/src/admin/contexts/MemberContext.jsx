import { createContext, useContext } from "react";
import { getAllMembers } from "@/services/GetService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";

const MemberContext = createContext(null);

const MemberProvider = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const members = data?.data;

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
