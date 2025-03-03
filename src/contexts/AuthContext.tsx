
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "user" | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultUser: AuthUser = {
  id: "1",
  name: "Admin User",
  email: "admin@scanify.com",
  role: "admin",
  avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
};

const defaultUserAccount: AuthUser = {
  id: "2",
  name: "Regular User",
  email: "user@scanify.com",
  role: "user",
  avatar: "https://ui-avatars.com/api/?name=Regular+User&background=0D8ABC&color=fff"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("scanify_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful login based on email
    if (email === "admin@scanify.com") {
      setUser(defaultUser);
      localStorage.setItem("scanify_user", JSON.stringify(defaultUser));
    } else {
      setUser(defaultUserAccount);
      localStorage.setItem("scanify_user", JSON.stringify(defaultUserAccount));
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("scanify_user");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
