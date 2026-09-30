"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  register: (payload: unknown) => Promise<{ token: string; user: User }>;
  logout: () => void;
  isAuthed: boolean;
  setUserOverride: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = Cookies.get("shopmart_token");
    if (saved) {
      setToken(saved);
      api
        .getMe(saved)
        .then((res) => setUser(res.data))
        .catch(() => {
          Cookies.remove("shopmart_token");
          setToken(null);
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.signin({ email, password });
    Cookies.set("shopmart_token", res.token, { expires: 7 });
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (payload: unknown) => {
    const res = await api.signup(payload);
    Cookies.set("shopmart_token", res.token, { expires: 7 });
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    Cookies.remove("shopmart_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        ready,
        login,
        register,
        logout,
        isAuthed: !!token,
        setUserOverride: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
