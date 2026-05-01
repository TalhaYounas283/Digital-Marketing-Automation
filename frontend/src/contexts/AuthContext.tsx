import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  apiClient,
  onAuthLogout,
} from "@/services/apiClient";

export type UserRole = "owner" | "manager" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
}

interface SessionResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (!storedUser || !storedToken) {
        setLoading(false);
        return;
      }
      try {
        const profile = await apiClient.get<AuthUser>("/auth/me");
        if (cancelled) return;
        setUser(profile);
        setToken(storedToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      } catch {
        apiClient.clearAuth();
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return onAuthLogout(() => {
      setUser(null);
      setToken(null);
    });
  }, []);

  const persistSession = useCallback((data: SessionResponse) => {
    apiClient.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.accessToken);
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    const data = await apiClient.post<SessionResponse>(
      "/auth/login",
      { email, password },
      { skipAuth: true },
    );
    persistSession(data);
  };

  const register: AuthContextType["register"] = async (name, email, password) => {
    const data = await apiClient.post<SessionResponse>(
      "/auth/register",
      { name, email, password },
      { skipAuth: true },
    );
    persistSession(data);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("automarketer_refresh");
      await apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {});
    } catch {
      /* swallow — we're logging out anyway */
    }
    apiClient.clearAuth();
    setUser(null);
    setToken(null);
  };

  const updateUser: AuthContextType["updateUser"] = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !!token,
        loading,
        user,
        token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
