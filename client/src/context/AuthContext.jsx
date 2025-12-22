import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("cc_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userObj) => {
    const normalized = {
      ...userObj,
      role: userObj?.role?.toLowerCase(),
      department: userObj?.department || userObj?.dept || null,
    };

    setUser(normalized);
    localStorage.setItem("cc_user", JSON.stringify(normalized));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cc_user");
  };

  const value = {
    user,
    isAuthed: !!user,
    role: user?.role || null,
    dept: user?.department || null,   
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);