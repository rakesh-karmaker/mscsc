import { verifyToken } from "@/services/GetService";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [viewer, setViewer] = useState(true);

  useEffect(() => {
    try {
      const userVerify = async () => {
        const res = await verifyToken(localStorage.getItem("token"));
        setViewer(res.data.viewer);
        setUser(res.data);
      };

      if (localStorage.getItem("token")) {
        userVerify();
      }
    } catch (err) {
      setUser(null);
      setViewer(true);
      console.log("Invalid Token");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, viewer }}>
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
