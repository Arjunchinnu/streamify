import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Lazy initialization (better performance)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "coffee";
  });

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AuthContext.Provider value={{ theme, setTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useTheme = () => useContext(AuthContext);
