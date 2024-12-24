import { verifyToken } from "@/services/GetService";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // localStorage.setItem("token", "");

  useEffect(() => {
    const userVerify = async () => {
      try {
        const res = await verifyToken(localStorage.getItem("token"));
        if (res && res.data) {
          setUser(res.data.user);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (err) {
        setUser(null);
        console.error("Failed to verify user token:", err);
      }
    };

    if (localStorage.getItem("token")) {
      userVerify();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loggedIn }}>
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
