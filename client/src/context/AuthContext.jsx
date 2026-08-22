import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("esahay_token");

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const register = async (userData) => {
    const data = await authService.register(userData);

    if (data.success) {
      setUser(data.user);
    }

    return data;
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);

    if (data.success) {
      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}