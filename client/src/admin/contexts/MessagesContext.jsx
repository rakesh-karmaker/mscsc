import { createContext, useContext } from "react";
import { getAllMessages } from "@/services/GetService";
import { useQuery } from "@tanstack/react-query";
const MessagesContext = createContext(null);

const MessagesProvider = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: getAllMessages,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const messages = data?.data;
  console.log(messages);

  return (
    <MessagesContext.Provider value={{ messages, isLoading }}>
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
