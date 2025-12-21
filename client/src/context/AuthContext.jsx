
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, name, role, dept, ...}

  useEffect(() => {
    const stored = localStorage.getItem("cityconnect_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

 
const login = (userObj) => {
  const normalized = {
    ...userObj,
    role: userObj?.role?.toLowerCase(), 
    department: userObj?.department || userObj?.dept || null,
  };

  setUser(normalized);
  localStorage.setItem("cityconnect_user", JSON.stringify(normalized));
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cityconnect_user");
  };

  const value = {
    user,
    isAuthed: !!user,
    role: user?.role || null,
    dept: user?.dept || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);