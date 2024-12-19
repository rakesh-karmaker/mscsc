import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = () => {};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
